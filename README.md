# DCell
> A deep neural network simulating cell structure and function

## Introduction
DCell is an application to provide an easy-to-use user interface and interpretable neural network structure for modeling cell structure and function.

Reference implementation is available here:

- http://d-cell.ucsd.edu/

## Publication

**Using deep learning to model the hierarchical structure and function of a cell**. 
*Jianzhu Ma, Michael Ku Yu, Samson Fong, Keiichiro Ono, Eric Sage, Barry Demchak, Roded Sharan & Trey Ideker*.  Nature Methods, 2018


## Directory Structure:

- ***training/code***: folder containing lua code for both neural network training and prediction.
- ***training/TrainData***: Training and predicting data.
- ***training/Topology***: Topology files for gene ontology.
- ***backend***: python wrapper code to perform predictions.
- ***frontend***: Javascript files to construct the web application server.
- ***data-builder***: Source files and scripts for backend database.

## Dependencies:
The code is based on Lua Torch running on a GPU linux system. See [here](http://torch.ch) for installation and basic tutorials.

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

Topology file defines the structure of an ontology as:

- ROOT: term_name #genes
- GENES: gene1, gene2, ...
- TERMS: child_term1, child_term2

### Output:
The model trained for each iteration will be saved in "-save model_file". The training program will produce a gene index mapping file saved in the same folder.

The predicting program will load both gene index file and trained model file and save the predictions in "-out result_file". 

### Data availability
To train the ontology on genetic interaction or growth using the gene ontology. 

Please download the ontology at: 

- http://geneontology.org/page/download-ontology 

Genetic interaction and growth is at:

- http://thecellmap.org/costanzo2016

The running time on a standard Tesla K20 GPU takes <2 minutes for terms like "DNA repair", and 2-3 days for using the GO and ~7 millions training data.

## User Documentation
Please visit our [wiki](https://github.com/idekerlab/DCell/wiki).

(3/5/2018: we are still updating user documentation.)

----
&copy; 2017-2018 UC, San Diego Trey Ideker Lab

Developed and Maintained by Keiichiro Ono (kono ucsd edu)
