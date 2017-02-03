import { createAction } from 'redux-actions'
import {Client} from 'elasticsearch'


const client = new Client({
  host: 'localhost:9200',
  log: 'info'
});


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

  const query = genes

  console.log('-----------------Calling')

  const params = {
    method: 'POST',
    body: JSON.stringify(query)
  }

  console.log(params)

  return fetch(serviceUrl, params)
}


export const runDeletion = (serviceUrl, genes, geneMap) => {

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

        const nodes = json.data.nodes
        const nodeIds = nodes.map(node => {
          return node.id
        })

        console.log("IDS:")
        console.log(nodeIds)

        searchIdMapping(nodeIds)
          .then(res2 => {
            console.log('got new res2')
            console.log(res2)

            const docs = res2.docs
            const result = replaceNodeData(nodes, docs, genes, geneMap)

          }).then(json2 => {
            console.log(json2)

            return dispatch(receiveSimulationResult(serviceUrl, genes, json))
          })
      })
  }
}

const replaceNodeData = (nodes, docs, genes, geneMap) => {

  const mapping = {}

  docs.forEach(entry => {

    if(entry['found']) {
      mapping[entry._id] = {
        name: entry._source.name,
        namespace: entry._source.namespace
      }
    }
  })


  genes.forEach(gene => {
    mapping[gene] = geneMap[gene]
  })


  console.log("MAP-_________________________________")
  console.log(mapping)

  return nodes.map(node => {
    const data = mapping[node.id]

    if(data !== undefined) {
      node.name = data.name
      node.namespace = data.namespace
    } else {
      node.name = node.id
      node.namespace = "N/A"
    }

    return node
  })
}


const searchIdMapping = query => {

  return client.mget(
    {
      index: 'terms',
      type: 'go_term',
      _source: ['name', 'namespace'],
      body: {
        ids: query
      }
    }
  )
}

export const ADD_GENE = 'ADD_GENE'
export const addGene = createAction(ADD_GENE)

export const DELETE_GENE = 'DELETE_GENE'
export const deleteGene = createAction(DELETE_GENE)

export const CLEAR_GENES = 'CLEAR_GENES'
export const clearGenes = createAction(CLEAR_GENES)
