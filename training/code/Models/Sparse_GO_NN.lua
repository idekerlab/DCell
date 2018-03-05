require 'nn'
require 'nngraph'
require 'cunn'
require 'cudnn'
require 'Utility'

function filter_term(term_state,children_term_map)

    result_list ={}
    
    for term_name, state in ipairs(term_state) do 
        
        if state == 0 then

            children_term_list = children_term_map[term_name]
            child_all_ready = true

            for i,child in ipairs(children_term_list) do
                if term_state[child] == 0 then child_all_ready = false;break end
            end

            if child_all_ready == true then table.insert(result_list,term_name) end

        end
    end

    return result_list
end

function get_neuron_num(term_size)
    return math.max(10,math.floor(0.3*term_size)) 
end

term_list,children_term_map,children_gene_map,term_size_map = load_topo_file(opt.topo)

term_state = {}
neuron_size_map = {}

print(term_list)

for i,term_name in ipairs(term_list) do 
    term_state[term_name] = 0
    neuron_size_map[term_name] = get_neuron_num(term_size_map[term_name]) 
end

-- Need to use term_map, gene_map, term_size_map, term_list, gene2id as global variables.

term_node_map = {}
gene_node_map = {}
mask_node_map = {}
loss_node_map = {}

gene_layer = nn.Identity()()

for i,term_name in pairs(term_list) do

	children_gene_list = children_gene_map[term_name]

	if #children_gene_list ~= 0 then
		
		local linear_layer = nn.Linear(#children_gene_list,neuron_size_map[term_name])(gene_layer):annotate{name='gene_'..term_name}
		gene_node_map[term_name] = linear_layer
		term_mask = torch.zeros(#children_gene_list,neuron_size_map[term_name])
		
		for j,gene_name in pairs(children_gene_list) do term_mask[gene2id[gene_name]] = 1 end
		mask_node_map[term_name] = term_mask:transpose(1,2)
	end
end

print("Constructing NN term --> combine gene --> batch normalization --> tanh")

while true do

    ready_term = filter_term(term_state,children_term_map)

    if #ready_term == 0 then break end

    print("New round selects", #ready_term, "terms")

    for i,term_name in ipairs(ready_term) do 
        
        children_term_list = children_term_map[term_name]
        children_gene_list = children_gene_map[term_name]

        child_hidden_list = {}
        input_size = 0

        for j,child in ipairs(children_term_list) do
            if term_node_map[child] == nil then print("Logical mistakes happen here",child,"missing!") end
            input_size = input_size + neuron_size_map[child]
            table.insert(child_hidden_list,term_node_map[child])
        end

        for j,child in ipairs(children_gene_list) do
            if gene_node_map[gene2id[child]] == nil then print("Missing gene node inputs",child) end
            input_size = input_size + 1
            table.insert(child_hidden_list,gene_node_map[gene2id[child]])
        end

        -- Combine term hidden and direct gene input
        if #child_hidden_list <= 1 then print(term_name);os.exit() end

        input_layer = nn.JoinTable(2)(child_hidden_list)
        
        --print(term_name,input_size,neuron_size_map[term_name],#child_hidden_list)

        if term_name ~= opt.root then 
            -- Linear transformation
            linear_layer = nn.Linear(input_size,neuron_size_map[term_name])(input_layer)
            
            -- Batch normalization
            BatchNorm_layer = nn.BatchNormalization(neuron_size_map[term_name])(linear_layer)

            -- Soft tanh 
            Tanh_layer = nn.Tanh()(BatchNorm_layer)

            term_node_map[term_name] = Tanh_layer

			loss_node_map[term_name] = auxillary_layer
        else
            -- For the root term, we don't binarize anything
            linear_layer = nn.Linear(input_size,neuron_size_map[term_name])(input_layer)

            -- Batch normalization
            BatchNorm_layer = nn.BatchNormalization(neuron_size_map[term_name])(linear_layer)

            -- Soft tanh
            Tanh_layer = nn.Tanh()(BatchNorm_layer)

			local linear_layer2 = nn.Linear(neuron_size_map[term_name],1)(Tanh_layer)

            term_node_map[term_name] = linear_layer2

        end
        term_state[term_name] = 1
    end    
end

local NN_model = nn.gModule(gene_node_map,{term_node_map[opt.root]})

local regression_loss = nn.MSECriterion()

local loss_vector = nn.ParallelCriterion(true)

for i,term_name in pairs(term_list) do
	if term_name == opt.root then
		loss_vector:add(regression_loss)
	else
		loss_vector:add(regression_loss,0.3)
	end
end

return{
    model = NN_model,
	loss = regression_loss
}
