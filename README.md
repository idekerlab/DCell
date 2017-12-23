# DCell
A neural network to interpret cell structure and function

## Introduction
DCell is an application to provide easy-to-use user interface to the D-Cell neural network for translate cell structure and functions.

Reference implementation is available here:

http://deep-cell.ucsd.edu/

## Running Example for Training and predicting using D-Cell
cd training_testing
th Train_DCell.lua -train training_file -test testing_file -topo ontology_file
th Predict_Dcell.lua -load model_file -test testing_file -out predicting_results
Detail usage of other parameters is the folder.

## Documentation
Please visit our [wiki](https://github.com/idekerlab/deep-cell/wiki).


## Developer's Guide
(TBD)

### Note
This application requires GPU-based backend service.  Source code for that service is not public yet.  Once we make it portable, it will be available as an open source project.



----
&copy; 2017-2018 UC, San Diego Trey Ideker Lab

Developed and Maintained by Keiichiro Ono (kono ucsd edu)
