# DCell
A neural network to interpret cell structure and function

## Introduction
DCell is an application to provide easy-to-use user interface to the D-Cell neural network for translate cell structure and functions.

Reference implementation is available here:

http://deep-cell.ucsd.edu/

## Directory Structure:
- **training/code**: folder containing lua code to training and predicting genetic interaction files
- **training/TrainData**: Training and predicting data
- **training/Topology**: Topology files for gene ontology
- **backend**: python wrapper code to perform the prediction
- **frontend**: Javascript file to construct the web server. 
- **data-builder**: Server testing files.

## Dependencies:
The code is based on Lua Torch running on GPU on linux system. See [here](http://torch.ch) for installation and basic tutorials. 

## Demo

### Training cmd: 
```
th Train_DCell.lua -train training_file -test testing_file -topo ontology_file -save model_file
```
### Predicting cmd:
```
th Predict_Dcell.lua -load model_file -test testing_file -out result_file [-gindex  gene_index_file]
```

Examples of training/testing files are in *TrainData/* and ontology files are in *Topology/*.

An topology file defines the structure of an ontology as:

- ROOT: term_name #genes
- GENES: gene1, gene2, ...
- TERMS: child_term1, child_term2
### Output:
The model trained for each iteration will be saved in "-save model_file". The training program will produce a gene index mapping file saved in the same folder.

The predicting program will load both gene index file and trained model file and save the predictions in "-out result_file". 

### Reproduction Instruction
To train the ontology on genetic interaction or growth using the gene ontology.
Please download the ontology at: http://geneontology.org/page/download-ontology
Genetic interaction and growth is at:
http://thecellmap.org/costanzo2016/
The running time on a standard Tesla K20 GPU takes <2 minutes for terms like "DNA repair", and 2-3 days for the real data.

## Documentation
Please visit our [wiki](https://github.com/idekerlab/deep-cell/wiki).


## Developer's Guide
(TBD)

### Note
This application requires GPU-based backend service.  Source code for that service is not public yet.  Once we make it portable, it will be available as an open source project.


----
&copy; 2017-2018 UC, San Diego Trey Ideker Lab

Developed and Maintained by Keiichiro Ono (kono ucsd edu)
