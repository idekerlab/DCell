require 'nn'
require 'nngraph'
require 'cutorch'
require 'cunn'
require 'xlua'
require 'optim'
require 'Utility'

---------------------Command-------------------------------------------------
cmd = torch.CmdLine()

cmd:text()
cmd:text('Training a simple network')
cmd:text()
cmd:text('Options')
cmd:option('-network',            './Binary_GO_NN.lua',              		'Model file - must return valid network.')
cmd:option('-save',               'model/',                   				'save directory')
cmd:option('-load',               '',                                       'load existing net weights')
cmd:option('-datapath',           './', 									'data folder')
cmd:option('-train',              '',   									'Training dataset')
cmd:option('-test', 			  '',										'Testing dataset')
cmd:option('-gindex',			  '',										'Gene index mapping file')
cmd:option('-devid',              1,                                        'device ID (if using CUDA)')
cmd:option('-nGPU',               1,                                        'num of gpu devices used')
cmd:option('-type',               'cuda',                                   'float or cuda')
cmd:option('-threads',            8,                                        'number of threads')
cmd:option('-LR',                 2^-6,                                     'learning rate')
cmd:option('-LRDecay',            0,                                        'learning rate decay (in # samples)')
cmd:option('-weightDecay',        0.0,                                      'L2 penalty on the weights')
cmd:option('-momentum',           0.0,                                      'momentum')
cmd:option('-batchSize',          800,                                      'batch size')
cmd:option('-epoch',              200,                                       'number of epochs to train, -1 for unbounded')
cmd:option('-optimization',       'adam',                                   'optimization method')

cmd:option('-topo',               'Topology/GO:0006281_topology',           'Ontology graph topology file')
cmd:option('-root',               'GO:0006281',                             'Root term for DNA repair')

cmd:text('===>Misc')
opt = cmd:parse(arg or {})

----------------------Treads----------------------------------------------------

torch.setnumthreads(opt.threads)

----------------------TensorType------------------------------------------------

torch.setdefaulttensortype('torch.FloatTensor')
local TensorType = 'torch.FloatTensor'

----------------------Data------------------------------------------------

if opt.train == '' then print('Training file is missing...') os.exit() end
if opt.topo == '' then print('Ontology file is missing...') os.exit() end

term_list, gene_list, children_term_map, children_gene_map, term_size_map = load_ontology_file(opt.topo)

print(opt.root,'ontology contains:')
print(#term_list,'terms')
print(#gene_list,'genes')

local gene2id_file = opt.save ..'/'.. opt.root ..'_gene2id_mapping'
print('No gene index file is provided, will create one at',gene2id_file)

gene2id = cal_gene2id(gene_list)
feature_dim = #gene_list

train_gene_pair_list, train_GI_list, max_KO = load_GI_file(opt.train)
TrainData, TrainLabel = list2torch(train_gene_pair_list, train_GI_list, gene2id, max_KO)
print('Loading training data',#train_GI_list)

if opt.test ~= '' then
	test_gene_pair_list, test_GI_list = load_GI_file(opt.test)
	TestData, TestLabel = list2torch(test_gene_pair_list,test_GI_list,gene2id, max_KO)
	print('Loading testing data',#test_GI_list)
end

print("Loading data complete...... feature dim",feature_dim)
if feature_dim <= 0 then print('No gene is included..') os.exit() end

----------------------Model------------------------------------------------

local GO_NN_model = require(opt.network)
model = GO_NN_model.model
loss = GO_NN_model.loss
root_id = GO_NN_model.root_id
term_mask = GO_NN_model.term_mask
print("Loading model complete......")

--print(term_name_list)
print("root ID",root_id)

local wfile = io.open(gene2id_file, "w")
wfile:write(opt.root..' '..tostring(root_id)..'\n')
for term, id in pairs(gene2id) do wfile:write(term..' '..tostring(id)..'\n') end
wfile:close()
----------------------Initialization---------------------------------------
for k, layer in ipairs(model.modules) do
	if layer.__typename == 'nn.Linear' then
		model.modules[k].weight:mul(0.01)
	end
end

----------------------Save model-------------------------------------------------------
os.execute('mkdir -p ' .. opt.save)

----------------------Cuda-------------------------------------------------------
if opt.type =='cuda' then
	cutorch.setDevice(opt.devid)
	cutorch.setHeapTracking(true)
	model:cuda()
	loss = loss:cuda()
	TensorType = 'torch.CudaTensor'
end

---Support for multiple GPUs - currently data parallel scheme
if opt.nGPU > 1 then
    local net = model
    model = nn.DataParallelTable(1)
    for i = 1, opt.nGPU do
        cutorch.setDevice(i)
        model:add(net:clone():cuda(), i)  -- Use the ith GPU
    end
    cutorch.setDevice(opt.devid)
end

----------------------Optimization------------------------------------------------
local Weights,Gradients = model:getParameters()

Weights,Gradients = model:getParameters()

local config = {
	learningRate = 0.001,
	beta1 = 0.9,
	beta2 = 0.99
	--momentum = 0.8
}

----------------------TrainOneEpoch------------------------------------

local function Learn4OneEpoch(Data, Label, train_mode, epoch)

	local NumSamples = Data:size(1)
	local lossVal = 0
	
	local train_predict
	local train_ground_truth
	
	for i = 1,NumSamples,opt.batchSize do
		
		local j = math.min(i+opt.batchSize-1,NumSamples)
		local yt = Label[{{i,j}}]:cuda()
		local x = Data[{{i,j}}]
		
		-- Expand Gene deletions in memory
		local xx = expand_KO(x,feature_dim,gene2id)
	
		-- For multiple GPUs, sync parameters among GPUs
		if opt.nGPU > 1 then model:syncParameters() end

		-- Here we consider the loss containing all loss functions
		local y = model:forward(xx)
	
		-- Here we only calculate the loss made by the root
		y_size = y[root_id]:size(1)
		if i == 1 then
			train_predict = y[root_id]:clone():resize(y_size)
			train_ground_truth = yt:clone():resize(y_size)
		else
			train_predict = torch.cat(train_predict,y[root_id]:clone():resize(y_size),1)
			train_ground_truth = torch.cat(train_ground_truth,yt:clone():resize(y_size),1)
		end
		
		local currLoss = loss:forward(y,yt)
		
		if train_mode == true then
			function feval()
				model:zeroGradParameters()
				local dE_dy = loss:backward(y, yt)
				model:backward(xx, dE_dy)

				for _,node in ipairs(model.forwardnodes) do
					if node.data.annotations.name ~= nil and string.sub(node.data.annotations.name,1,5) ~= "gene_" then
						--print(term_name,node.data.module.gradWeight:size())
						term_name = string.sub(node.data.annotations.name,6)
						grad_mask = term_mask[term_name]:cuda()

						if grad_mask == nil then print("There is no mask there..") end
						
						--print(term_name,node.data.module.gradWeight)
						weight_size = node.data.module.gradWeight:size()
						mask_size = grad_mask:size()

						if mask_size[1] ~= weight_size[1] or mask_size[2] ~= weight_size[2] then
							print("Gradient mistakes, size not match!",term_name)
							os.exit()
						end
				
						node.data.module.gradWeight:cmul(grad_mask)
					end
				end

				return currLoss, Gradients
			end

			optim.adam(feval, Weights, config)
		end

		lossVal = currLoss + lossVal
		
		if math.fmod(i,2)==0 then collectgarbage() end
	end

	corr = pearson(train_predict, train_ground_truth)
	
	if train_mode == true then
		print("Training correlation:", corr, 'MSE:',lossVal/math.ceil(NumSamples/opt.batchSize))
		model:clearState()

		local last_netFilename = opt.save ..'/'.. opt.root ..'_model_'..tostring(epoch)..'.t7'
		torch.save(last_netFilename, model)
	else
		print("Testing correlation:", corr , 'MSE:',lossVal/math.ceil(NumSamples/opt.batchSize))
	end

end

print '\n==> Starting Training\n'
collectgarbage()

for epoch = 1,opt.epoch do
	print('Epoch ' .. epoch)

    model:training()
    Learn4OneEpoch(TrainData, TrainLabel, true, epoch)  
 
	if opt.test ~= '' then 
    	model:evaluate()
    	Learn4OneEpoch(TestData, TestLabel, false, epoch)
	end
end
