require 'torch'
require 'cutorch'
require 'cunn'

function table2set(l)
    local a = {}
	local set = {}
    for _, v in ipairs(l) do a[v] = true end
	for key, value in pairs(a) do table.insert(set,key) end

    return set
end

function load_gene2id(gene2id_file)

    local rfile = io.open(gene2id_file, "r")

    gene2id = {}
    feature_dim = 0
	root_id = 0

    for line in rfile:lines() do
        string_array = string_split(line)

		if feature_dim == 0 then
			root_id = tonumber(string_array[2])
		else
        	gene2id[string_array[1]] = tonumber(string_array[2])
        end

		feature_dim = feature_dim + 1
    end

    return gene2id, feature_dim-1, root_id
end

function cal_gene2id(gene_list)
    local gene2id = {}
    for id, gene in ipairs(gene_list) do gene2id[gene] = id end
    return gene2id
end

function list2torch(genotype_list, phenotype_list, gene2id, max_KO)

    local genotype_th = torch.ones(#genotype_list,max_KO+1) * -1
    local phenotype_th = torch.zeros(#genotype_list)

    for i, genotype in ipairs(genotype_list) do

		genotype_th[i][1] = #genotype

		for j, gene in ipairs(genotype) do
			if gene2id[gene] == nil then print('Gene',gene,'does not have index...') os.exit() end
			genotype_th[i][j+1] = gene2id[gene]
        end

        phenotype_th[i] = phenotype_list[i]
    end

    return genotype_th, phenotype_th
end

function pearson(x, y)
    local xx = x - x:mean()
    local yy = y - y:mean()
    return xx:dot(yy) / (xx:norm() * yy:norm())
end

function expand_KO(phenotype_th,feature_num,gene2id)

    local feature = torch.zeros(phenotype_th:size(1),feature_num)

    for i = 1, phenotype_th:size(1) do
		for j = 1, phenotype_th[i][1] do feature[i][phenotype_th[i][j+1]] = 1 end
    end

    return feature:cuda()
end

function string_split(str) 

    string_array = {}
    index = 1
    for value in string.gmatch(str,"[^%s]+") do
        string_array[index] = value
        index = index + 1
    end

    return string_array
end

function load_GI_file(GI_file)
   
    local rfile = io.open(GI_file, "r")
    assert(rfile)

    genotype_list = {}
    phenotype_list = {}
	max_KO_num = -1

    for line in rfile:lines() do
        
		string_array = string_split(line)

		KO_num = tonumber(string_array[1])

		if KO_num > max_KO_num then max_KO_num = KO_num end

		genotype = {}
		for i = 1,KO_num do genotype[i] = string_array[i+1] end

		table.insert(genotype_list, genotype)

		if #string_array > KO_num + 1 then table.insert(phenotype_list, tonumber(string_array[2+KO_num])) end

    end

    rfile:close()

    return genotype_list, phenotype_list, max_KO_num
end

function load_ontology_file(topo_file) 

    local rfile = io.open(topo_file, "r")  
    assert(rfile) 

    local children_term_map = {};local children_gene_map = {};local term_size_map = {};local term_list = {};local gene_list = {}

    while true do

        local line = rfile:read()

        if line == nil then break end

        string_array = string_split(line)

        local term_name = string_array[2]
		local gene_num = string_array[3]

        table.insert(term_list,term_name)

        line = rfile:read()

        string_array = string_split(line)
    
        children_gene_list = {}        
        for i = 2,#string_array do
            children_gene_list[i-1] = string_array[i]
			table.insert(gene_list, string_array[i])
        end
        
        line = rfile:read()
        string_array = string_split(line)

        children_term_list = {}
        for i = 2,#string_array do
            children_term_list[i-1] = string_array[i]
        end

        children_term_map[term_name] = children_term_list
        children_gene_map[term_name] = children_gene_list
        term_size_map[term_name] = tonumber(gene_num)
    end
	
	rfile:close()

	gene_list = table2set(gene_list)

    return term_list, gene_list, children_term_map, children_gene_map, term_size_map
end 
