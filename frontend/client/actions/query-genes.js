import {createAction} from 'redux-actions'
import config from '../assets/config.json'
const baseUrl = config.backendServices.goUtil

const termMapUrl = config.backendServices.search
const TERM_MAP_URL = `${termMapUrl}/map`

const GO_UTIL_URL = `${baseUrl}/map/`


export const RUN_SIMULATION = 'RUN_SIMULATION'

const runSimulation = (serviceUrl, queryType, genesMap) => {

  return {
    type: RUN_SIMULATION,
    serviceUrl,
    queryType,
    genes: genesMap,
    error: null
  }
}


export const RECEIVE_SIMULATION_RESULT = 'RECEIVE_SIMULATION_RESULT'
const receiveSimulationResult = (serviceUrl, queryType, genesMap, json, error) => {

  return {
    type: RECEIVE_SIMULATION_RESULT,
    serviceUrl,
    queryType,
    genes: genesMap,
    result: json,
    error: error
  }
}

export const FETCH_CHILDREN = 'FETCH_CHILDREN'

const fetchChildren = (serviceUrl, termId) => {

  return {
    type: FETCH_CHILDREN,
    serviceUrl,
    pivot: termId,
  }
}

export const RECEIVE_CHILDREN = 'RECEIVE_CHILDREN'
const receiveChildren = (serviceUrl, json, pivot) => {

  return {
    type: RECEIVE_SIMULATION_RESULT,
    serviceUrl,
    pivot,
    result: json,
    error: null
  }
}


const fetchResult = (serviceUrl, genesMap) => {

  const query = Object.keys(genesMap.toJS())

  const params = {
    method: 'POST',
    body: JSON.stringify(query)
  }

  console.log(params)

  return fetch(serviceUrl, params)
}


export const pivot = (currentDag, serviceUrl, termId) => {
  return dispatch => {

    dispatch(fetchChildren(serviceUrl, termId))

    const url = serviceUrl + termId + '/children'

    return fetch(url)
      .then(response => (response.json()))
      .then(json => {

        const nodes = json.elements.nodes
        const edges = json.elements.edges

        nodes.forEach(n => {
          console.log(n)
          if (n.id !== termId) {
            currentDag.data.nodes.push({
              id: n.data.id,
              name: n.data.name,
              importance: -1,
              phenotype: -1,
              neutons: [],
              namespace: ''
            })
          }
        })

        edges.forEach(e => {
          console.log(e)
          currentDag.data.edges.push({
            source: e.data.source,
            target: e.data.target
          })
        })

        return dispatch(receiveChildren(serviceUrl, currentDag, termId))
      })
  }

}

export const runDeletion = (serviceUrl, queryType, genesMap, geneMap) => {

  return dispatch => {
    dispatch(runSimulation(serviceUrl, queryType, genesMap))

    return fetchResult(serviceUrl, genesMap)

      .then(response => {
        if (!response.ok) {
          console.error('Simulation failed:', response)
          throw new Error('Simulator response was not ok');

        }
        console.log(response)
        return response.json()
      })
      .then(json => {
        console.log('got DAG json in cyjs format')
        console.log(json)

        const errors = json.errors

        if (errors !== undefined && errors.length !== 0) {

          return dispatch(receiveSimulationResult(serviceUrl, queryType, genesMap, null, errors[0]))

        } else {
          const nodes = json.data.nodes
          const nodeIds = nodes.map(node => {
            return node.id
          })

          let newNodes = null

          searchIdMapping(nodeIds)
            .then(res2 => {
              const docs = res2.docs
              const result = replaceNodeData(nodes, docs, genesMap, geneMap)

            })

            .then(result2 => {
              const ids = nodeIds.join(',')
              const mapUrl = GO_UTIL_URL + ids
              fetch(mapUrl)
                .then(response => (response.json()))
                .then(idmap => {
                  newNodes = id2Name(nodes, idmap)
                })
                .then(json2 => {

                  return dispatch(receiveSimulationResult(serviceUrl, queryType, genesMap, json, null))
                })
            })
        }

      })
      .catch(onServerError)
  }
}


const onServerError = serverErr => {
  console.log('!! There has been a problem with your fetch operation: ');
  console.log(serverErr)

}

const id2Name = (nodes, idmap) => {
  nodes.forEach(n => {
    if(n.name === n.id) {
      const name = idmap[n.id]
      if(name !== undefined) {
        n.name = idmap[n.id]
      }
    }
  })
}


const replaceNodeData = (nodes, docs, genesMap, geneMap) => {

  const mapping = {}

  docs.forEach(entry => {

    if (entry['found']) {
      mapping[entry._id] = {
        name: entry._source.name,
        namespace: entry._source.namespace
      }
    }
  })

  const genes = Object.keys(genesMap.toJS())
  const gm = genesMap.toJS()


  genes.forEach(gene => {
    mapping[gene] = geneMap[gene]
  })


  return nodes.map(node => {
    const data = mapping[node.id]

    if (data !== undefined) {
      node.name = data.name
      node.namespace = data.namespace
    } else {
      if (gm[node.id] !== undefined) {
        node.name = gm[node.id]
      } else {
        node.name = node.id
      }
      node.namespace = "N/A"
    }

    return node
  })
}



const searchIdMapping = query => {

  const obj = {
    query
  };
  const method = "POST";
  const body = JSON.stringify(obj);
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  console.log('Mapping terms:', query)

  return fetch(TERM_MAP_URL, {method, headers, body})
}

//   return client.mget(
//     {
//       index: 'terms',
//       type: 'go_term',
//       _source: ['name', 'namespace'],
//       body: {
//         ids: query
//       }
//     }
//   )
// }


export const ADD_GENE = 'ADD_GENE'
export const addGene = createAction(ADD_GENE)

export const DELETE_GENE = 'DELETE_GENE'
export const deleteGene = createAction(DELETE_GENE)

export const CLEAR_GENES = 'CLEAR_GENES'
export const clearGenes = createAction(CLEAR_GENES)

export const CLEAR_RESULTS = 'CLEAR_RESULTS'
export const clearResults = createAction(CLEAR_RESULTS)
