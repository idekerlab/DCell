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
cmd:option('-load',               '',                                       'load existing net weights')
cmd:option('-datapath',           './', 									'data folder')
cmd:option('-test', 			  '',										'Testing dataset')
cmd:option('-gindex',			  '',										'Gene index mapping file')
cmd:option('-devid',              1,                                        'Device ID (if using CUDA)')
cmd:option('-nGPU',               1,                                        'Num of gpu devices used')
cmd:option('-type',               'cuda',                                   'Float or cuda')
cmd:option('-threads',            8,                                        'Number of threads')
cmd:option('-batchSize',          800,                                      'Batch size')
cmd:option('-out',				  '',										'Output file')
cmd:text('===>Misc')
opt = cmd:parse(arg or {})

----------------------Treads----------------------------------------------------

torch.setnumthreads(opt.threads)

----------------------TensorType------------------------------------------------

torch.setdefaulttensortype('torch.FloatTensor')
local TensorType = 'torch.FloatTensor'

----------------------Data------------------------------------------------

if opt.test == '' then print('Predicting file is missing...') os.exit() end
if opt.gindex == '' then print('Gene index file is missing...') os.exit() end

gene2id, feature_dim, root_id = load_gene2id(opt.gindex)

test_gene_pair_list, test_GI_list, max_KO = load_GI_file(opt.test)
TestData, TestLabel = list2torch(test_gene_pair_list,test_GI_list,gene2id, max_KO)
print('Loading testing data',#test_GI_list)

print("Loading data complete...... feature dim",feature_dim)
if feature_dim <= 0 then print('No gene is included..') os.exit() end

----------------------Model------------------------------------------------
model = torch.load(opt.load)

model:evaluate()
print('==>Loaded model from: ' .. opt.load)
print(model)
print("Loading model complete......")

print("root ID",root_id)

----------------------Cuda-------------------------------------------------------
if opt.type =='cuda' then
	cutorch.setDevice(opt.devid)
	cutorch.setHeapTracking(true)
	model:cuda()
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

----------------------TrainOneEpoch------------------------------------

local function Learn4OneEpoch(Data, Label)

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
		
	end

	corr = pearson(train_predict, train_ground_truth)
	print("Testing correlation:", corr)

	return train_predict
end

model:evaluate()
predict = Learn4OneEpoch(TestData, TestLabel)

if opt.out ~= '' then

	local wfile = io.open(opt.out, "w")

	for i = 1,predict:size(1) do
		output_str = ''
		for j = 1, #test_gene_pair_list[i] do output_str = output_str .. test_gene_pair_list[i][j]..' ' end
		output_str = output_str .. tostring(predict[i])
		wfile:write(output_str..'\n')
	end
	wfile:close()
end
