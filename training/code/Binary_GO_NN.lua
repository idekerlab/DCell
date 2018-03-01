require 'nn'
require 'nngraph'
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
    return math.max(10,math.floor(0.2*term_size)) 
    --return 10
end

--term_list,children_term_map,children_gene_map,term_size_map = load_topo_file(opt.topo)

local term_state = {}
local neuron_size_map = {}

for i,term_name in ipairs(term_list) do 
    term_state[term_name] = 0
    neuron_size_map[term_name] = get_neuron_num(term_size_map[term_name]) 
end

-- Need to use term_map, gene_map, term_size_map, term_list, gene2id as global variables.

local term_node_map = {}
local gene_node_map = {}
local loss_node_map = {}
local mask_node_map = {}

gene_layer = nn.Identity()()

print('Total gene num', feature_dim)

for i,term_name in ipairs(term_list) do
    
	children_gene_list = children_gene_map[term_name]

	if #children_gene_list ~= 0 then

		print(term_name, neuron_size_map[term_name])
		
		local linear_layer = nn.Linear(feature_dim,neuron_size_map[term_name])(gene_layer):annotate{name= 'gene_'..term_name}
        
		gene_node_map[term_name] = linear_layer

        term_mask = torch.zeros(feature_dim,neuron_size_map[term_name])
   
		--print(term_mask:size(1), term_mask:size(2),'cao nima')
 
        for j, gene_name in ipairs(children_gene_list) do
			--print(j, gene_name, gene2id[gene_name])
			--if gene2id[gene_name] == nil then print(gene_name) os.exit() end
            term_mask[gene2id[gene_name]] = 1
        end
        mask_node_map[term_name] = term_mask:transpose(1,2) 
    end
end

print("Constructing NN term --> combine gene --> batch normalization --> hard tanh --> residue --> binary")

--print("gene_node_map size",#gene_node_map)

while true do

    ready_term = filter_term(term_state,children_term_map)

    if #ready_term == 0 then break end

    print("New round selects",#ready_term,"terms")

    for i,term_name in ipairs(ready_term) do 
        
        children_term_list = children_term_map[term_name]
        children_gene_list = children_gene_map[term_name]

        child_hidden_list = {}
        input_size = 0
        local input_layer

        if #children_term_list > 0 then

            for j,child in ipairs(children_term_list) do
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
		hidden_num = neuron_size_map[term_name]
        --print(term_name,input_size,neuron_size_map[term_name],#child_hidden_list)
	
        if term_name ~= opt.root then
            -- Linear transformation
            linear_layer = nn.Linear(input_size,hidden_num)(input_layer)

            -- Batch normalization
            --BatchNorm_layer = nn.BatchNormalization(hidden_num)(linear_layer)
            
			-- Soft tanh 
            --Tanh_layer = nn.Tanh()(BatchNorm_layer)
			Tanh_layer = nn.Tanh()(linear_layer)
			BatchNorm_layer = nn.BatchNormalization(hidden_num)(Tanh_layer)
            --term_node_map[term_name] = Tanh_layer
           	term_node_map[term_name] = BatchNorm_layer
 
            --if term_size_map[term_name] > 30 then
            --auxillary_linear_layer = nn.Tanh()(nn.Linear(neuron_size_map[term_name],1)(input_layer))
            auxillary_layer = nn.Tanh()(nn.Linear(hidden_num,1)(Tanh_layer))
			loss_node_map[term_name] = auxillary_layer
            --end
        else
            linear_layer = nn.Linear(input_size, hidden_num)(input_layer)
        
            --BatchNorm_layer = nn.BatchNormalization(neuron_size_map[term_name])(linear_layer)

            --Tanh_layer = nn.Tanh()(BatchNorm_layer)           
			Tanh_layer = nn.Tanh()(linear_layer)

			BatchNorm_layer = nn.BatchNormalization(hidden_num)(Tanh_layer)

            --linear_layer2 = nn.Linear(hidden_num,1)(Tanh_layer)
			linear_layer2 = nn.Linear(hidden_num,1)(BatchNorm_layer)            

            term_node_map[term_name] = linear_layer2

            loss_node_map[term_name] = linear_layer2
        end
        
        term_state[term_name] = 1
    end    
end

output_term_list = {}
index = 1

for term_name,neuron in pairs(loss_node_map) do
    table.insert(output_term_list,neuron)
	if term_name == opt.root then root_index = index end
	index = index + 1
end

local NN_model = nn.gModule({gene_layer},output_term_list)

--local loss_vector= nn.MSECriterion()
--local regression_loss = nn.SmoothL1Criterion()
local loss_vector = nn.ParallelCriterion(true)

for i,term_name in ipairs(term_list) do
	local regression_loss = nn.MSECriterion()
    if term_name == opt.root then
        loss_vector:add(regression_loss)
    else
        loss_vector:add(regression_loss,0.5)
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
	root_id = root_index,
    --term_name_list = term_list,
    term_mask = mask_node_map
    --lrs = learningRates,
    --clipV =clipvector
}
