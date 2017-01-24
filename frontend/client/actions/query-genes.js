import { createAction } from 'redux-actions'

export const RUN_SIMULATION = 'RUN_SIMULATION'

const runSimulation = (serviceUrl, genes) => {

  return {
    type: RUN_SIMULATION,
    serviceUrl,
    genes
  }
}


export const RECEIVE_SIMULATION_RESULT = 'RECEIVE_SIMULATION_RESULT'
const receiveSimulationResult = (serviceUrl, genes, json) => {

  return {
    type: RECEIVE_SIMULATION_RESULT,
    serviceUrl,
    genes,
    result: json
  }
}


const fetchResult = (serviceUrl, genes) => {

  // const query = genes
  const query = ["YBL098W" ,"YPL133C"]

  console.log('-----------------Calling')

  const params = {
    method: 'POST',
    body: JSON.stringify(query)
  }

  console.log(params)

  return fetch(serviceUrl, params)
}


export const runDeletion = (serviceUrl, genes) => {

  return dispatch => {
    dispatch(runSimulation(serviceUrl, genes))

    return fetchResult(serviceUrl, genes)
      .then(response => {
        console.log(response)
        // return response.text()

        return response.json()

      })
      .then(json => {
        console.log('got json')
        console.log(json)

        return dispatch(receiveSimulationResult(serviceUrl, genes, json))
      })
  }
}


export const ADD_GENE = 'ADD_GENE'
export const addGene = createAction(ADD_GENE)

export const DELETE_GENE = 'DELETE_GENE'
export const deleteGene = createAction(DELETE_GENE)

export const CLEAR_GENES = 'CLEAR_GENES'
export const clearGenes = createAction(CLEAR_GENES)
