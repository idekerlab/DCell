require 'nn'
require 'nngraph'
require './BinaryLinear'
require './BinarizedNeurons'
require 'cunn'
require 'cudnn'
require 'Utility'

function filter_term(term_state,children_term_map)

    result_list ={}
    
    for term_name,state in pairs(term_state) do 
        
        if state == 0 then

            children_term_list = children_term_map[term_name]
            child_all_ready = true

            for i,child in pairs(children_term_list) do
                if term_state[child] == 0 then child_all_ready = false;break end
            end

            if child_all_ready == true then table.insert(result_list,term_name) end

        end
    end

    return result_list
end

function get_neuron_num(term_size)
    --return math.max(10,math.floor(0.2*term_size)) 
    return 10
end

local BatchNormalization;

--[[
if opt.SBN == true then
    require './BatchNormalizationShiftPow2'
    BatchNormalization = BatchNormalizationShiftPow2
else
    BatchNormalization = nn.BatchNormalization
end
]]
term_list,children_term_map,children_gene_map,term_size_map = load_topo_file(opt.topo)

local term_state = {}
local neuron_size_map = {}

for i,term_name in pairs(term_list) do 
    term_state[term_name] = 0
    neuron_size_map[term_name] = get_neuron_num(term_size_map[term_name]) 
end

-- Need to use term_map, gene_map, term_size_map, term_list, gene2id as global variables.

local term_node_map = {}
local gene_node_map = {}
local loss_node_map = {}
local mask_node_map = {}
--for gene_name,id in pairs(gene2id) do input = nn.Identity()():annotate{name=gene_name}; gene_node_map[id] = input; end

gene_layer = nn.Identity()()

for i,term_name in pairs(term_list) do
    
	children_gene_list = children_gene_map[term_name]
    if #children_gene_list ~= 0 then
    
        local linear_layer = nn.Linear(129,neuron_size_map[term_name])(gene_layer):annotate{name=term_name}
        local BatchNorm_layer =nn.BatchNormalization(neuron_size_map[term_name])(linear_layer)
        local Tanh_layer = nn.HardTanh()(BatchNorm_layer)
        local Binary_layer = BinarizedNeurons(false)(Tanh_layer):annotate{name="binary_"..term_name}

        gene_node_map[term_name] = Binary_layer

        term_mask = torch.zeros(129,neuron_size_map[term_name])
    
        for j,gene_name in pairs(children_gene_list) do
            term_mask[gene2id[gene_name]] = 1
        end
        mask_node_map[term_name] = term_mask:transpose(1,2) 
    end
end
print("Constructing NN term --> combine gene --> batch normalization --> hard tanh --> residue --> binary")

--print("gene_node_map size",#gene_node_map)

--local input_layer = nn.JoinTable(2)(gene_node_map)
--L1 = BinarizedNeurons(true)(nn.HardTanh()(BatchNormalization(numHid,true)(BinaryLinear(129, numHid,false)(input_layer))))
--L2 = BinarizedNeurons(true)(nn.HardTanh()(BatchNormalization(numHid,true)(BinaryLinear(numHid, numHid,false)(L1))))
--L3 = nn.Tanh()(nn.Linear(numHid, 1)(L2))

--local L1 = BinarizedNeurons(false)(nn.HardTanh()(BatchNormalization(numHid,true)(BinaryLinear(129, numHid,false)(input_layer))))
--local L2 = BinarizedNeurons(false)(nn.HardTanh()(BatchNormalization(numHid,true)(BinaryLinear(numHid, numHid,false)(L1))))
--[[
a = {}
for i =1,2 do
    a[i] = nn.Linear(129,5)(gene_layer):annotate{name='gene_name'..tostring(i)}
end
--local L1 = nn.ConcatTable()(a)

input_layer = nn.Tanh()(nn.JoinTable(2)(a))
]]
--NN_model:add(mlp)
--NN_model:add(nn.JoinTable(2))
--NN_model:add(nn.Linear(10,1))
--NN_model:add(nn.Tanh())

--local L2  = nn.Tanh()(nn.Linear(10,1)(input_layer))
--local L3 = nn.Linear(numHid, 1)(L1)

--local NN_model = nn.gModule(gene_node_map,{L3})
--local NN_model = nn.gModule({input_layer},{L3})

--local NN_model = nn.gModule({gene_layer},{L2})

while true do

    ready_term = filter_term(term_state,children_term_map)

    if #ready_term == 0 then break end

    print("New round selects",#ready_term,"terms")

    for i,term_name in pairs(ready_term) do 
        
        children_term_list = children_term_map[term_name]
        children_gene_list = children_gene_map[term_name]

        child_hidden_list = {}
        input_size = 0
        local input_layer

        if #children_term_list > 0 then

            for j,child in pairs(children_term_list) do
                if term_node_map[child] == nil then print("Logical mistakes happen here",child,"missing!") end
                input_size = input_size + neuron_size_map[child]
                table.insert(child_hidden_list,term_node_map[child])
            end

            if #children_gene_list ~=0 then
                input_size = input_size + neuron_size_map[term_name]
                table.insert(child_hidden_list,gene_node_map[term_name])         
            end

            input_layer = nn.JoinTable(2)(child_hidden_list)
        else
            input_size = neuron_size_map[term_name]
            input_layer = gene_node_map[term_name]
        end
        -- Combine term hidden and direct gene input

        --print(term_name,input_size,neuron_size_map[term_name],#child_hidden_list)

        if term_name ~= opt.root then 
            -- Linear transformation
            --linear_layer = BinaryLinear(input_size,neuron_size_map[term_name],true)(input_layer)
            linear_layer = nn.Linear(input_size,neuron_size_map[term_name])(input_layer)

            -- Batch normalization
            --BatchNorm_layer = BatchNormalization(neuron_size_map[term_name],false)(linear_layer)
            BatchNorm_layer = nn.BatchNormalization(neuron_size_map[term_name])(linear_layer)
            -- Hard tanh 
            Tanh_layer = nn.HardTanh()(BatchNorm_layer)
            --Tanh_layer = nn.Tanh()(BatchNorm_layer)
            --Tanh_layer = nn.Tanh()(linear_layer)
            -- Residual 
            --Residue_layer = nn.CAddTable(){Tanh_layer,linear_layerj}

            -- Binarize output
            -- Binary_layer = BinarizedNeurons(true)(Residue_layer)
            Binary_layer = BinarizedNeurons(false)(Tanh_layer):annotate{name="binary_"..term_name}

            Dropout_layer = nn.Dropout(0.5)(Binary_layer)

            --term_node_map[term_name] = Binary_layer

            term_node_map[term_name] = Dropout_layer
            
            --if term_size_map[term_name] > 30 then
            --auxillary_linear_layer = nn.Tanh()(nn.Linear(neuron_size_map[term_name],1)(input_layer))
            auxillary_linear_layer = nn.Tanh()(nn.Linear(neuron_size_map[term_name],30)(Binary_layer))
            --auxillary_linear_layer = nn.Tanh()(nn.Linear(neuron_size_map[term_name],30)(Tanh_layer))
            --auxillary_linear_layer = nn.Tanh()(nn.Linear(neuron_size_map[term_name],1)(Dropout_layer))
                auxillary_layer = nn.Tanh()(nn.Linear(30,1)(auxillary_linear_layer))
                loss_node_map[term_name] = auxillary_layer
            --end
        else
            -- For the root term, we don't binarize anything
            --linear_layer = BinaryLinear(input_size,neuron_size_map[term_name],true)(input_layer)
            linear_layer = nn.Linear(input_size,neuron_size_map[term_name])(input_layer)
            --linear_layer = nn.Linear(input_size,1)(input_layer)
        
            --linear_layer = nn.Linear(input_size,1000)(input_layer)  
            --BatchNorm_layer = BatchNormalization(neuron_size_map[term_name],false)(linear_layer)
            BatchNorm_layer = nn.BatchNormalization(neuron_size_map[term_name])(linear_layer)

            Tanh_layer = nn.Tanh()(BatchNorm_layer)           
            --Tanh_layer = nn.Tanh()(linear_layer)
            -- Binary_layer = BinarizedNeurons(false)(Tanh_layer)
            Dropout_layer = nn.Dropout(0.5)(Tanh_layer)

            --linear_layer2 = nn.Linear(neuron_size_map[term_name],1)(Tanh_layer)
            linear_layer2 = nn.Linear(neuron_size_map[term_name],1)(Dropout_layer)
            
            BatchNorm_layer2 = nn.BatchNormalization(1)(linear_layer2)
            -- Soft tanh
            Tanh_layer3 = nn.Tanh()(BatchNorm_layer2)

            --Tanh_layer3 = nn.Tanh()(linear_layer2)

            --linear_layer3 = nn.Linear(2000,1)(Tanh_layer3)

            --Tanh_layer3 = nn.Tanh()(linear_layer3)

            -- Residual
            --Residue_layer = nn.CAddTable(){Tanh_layer,linear_layer}

            --Dropout_layer = nn.Dropout(0.5)(Residue_layer)

            term_node_map[term_name] = Tanh_layer3

            loss_node_map[term_name] = Tanh_layer3
        end
        
        term_state[term_name] = 1
    end    
end

output_term_list = {}
--term_list = {}

for term_name,neuron in pairs(loss_node_map) do
    table.insert(output_term_list,neuron) 
    --table.insert(term_list,term_name)
end
--]]

local NN_model = nn.gModule({gene_layer},output_term_list)

--local loss_vector= nn.MSECriterion()
local regression_loss = nn.SmoothL1Criterion()
local loss_vector = nn.ParallelCriterion(true)

for i,term_name in pairs(term_list) do
    if term_name == opt.root then
        loss_vector:add(regression_loss)
    else
        loss_vector:add(regression_loss,0.3)
    end
end
--[[
local dE, param = NN_model:getParameters()
local weight_size = dE:size(1)
local learningRates = torch.Tensor(weight_size):fill(0)
local clipvector = torch.Tensor(weight_size):fill(0)

local counter = 0
for i, layer in ipairs(NN_model.modules) do
    if layer.__typename == 'BinaryLinear' then
        local weight_size = layer.weight:size(1)*layer.weight:size(2)
        local size_w=layer.weight:size();   GLR=1/torch.sqrt(1.5/(size_w[1]+size_w[2]))
        
        --learningRates[{{counter+1, counter+weight_size}}]:fill(GLR)
        clipvector[{{counter+1, counter+weight_size}}]:fill(1)
        counter = counter+weight_size
        
        local bias_size = layer.bias:size(1)
        --learningRates[{{counter+1, counter+bias_size}}]:fill(GLR)
        clipvector[{{counter+1, counter+bias_size}}]:fill(0)
        counter = counter+bias_size
    
    elseif layer.__typename == 'BatchNormalizationShiftPow2' then
        local weight_size = layer.weight:size(1)
        local size_w=layer.weight:size();   GLR=1/torch.sqrt(1.5/(size_w[1]))
        --learningRates[{{counter+1, counter+weight_size}}]:fill(GLR)
        clipvector[{{counter+1, counter+weight_size}}]:fill(0)
        counter = counter+weight_size
        
        local bias_size = layer.bias:size(1)
        --learningRates[{{counter+1, counter+bias_size}}]:fill(1)
        clipvector[{{counter+1, counter+bias_size}}]:fill(0)
        counter = counter+bias_size

    elseif layer.__typename == 'nn.BatchNormalization' then
        local weight_size = layer.weight:size(1)
        local size_w=layer.weight:size();   GLR=1/torch.sqrt(1.5/(size_w[1]))
        --learningRates[{{counter+1, counter+weight_size}}]:fill(GLR)
        clipvector[{{counter+1, counter+weight_size}}]:fill(0)
        counter = counter+weight_size
        local bias_size = layer.bias:size(1)
        --learningRates[{{counter+1, counter+bias_size}}]:fill(1)
        clipvector[{{counter+1, counter+bias_size}}]:fill(0)
        counter = counter+bias_size
    end
end
]]
return{
    model = NN_model,
    loss = loss_vector,
    term_name_list = term_list,
    term_mask = mask_node_map
    --lrs = learningRates,
    --clipV =clipvector
}
