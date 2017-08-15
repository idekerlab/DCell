export const FETCH_NETWORK = 'FETCH_NETWORK'
const fetchNetwork = url => {
  return {
    type: FETCH_NETWORK,
    url
  }
}


export const RECEIVE_NETWORK = 'RECEIVE_NETWORK'
const receiveNetwork = (url, json) => {

  return {
    type: RECEIVE_NETWORK,
    url,
    network: json
  }
}

const fetchNet = url => {
  return fetch(url)
}

export const fetchNetworkFromUrl = url => {

  return dispatch => {
    dispatch(fetchNetwork(url))

    return fetchNet(url)
      .then(response => (response.json()))
      .then(network => (calculateLabelSize(network)))
      .then(json =>
        dispatch(receiveNetwork(url, json))
      )
  }
}


import * as d3Scale from 'd3-scale'

const labelSizeMapper = d3Scale.scaleLinear()
  .domain([1, 6000])
  .range([6, 450]);

const calculateLabelSize = network => {

  const nodes = network.elements.nodes
  nodes.forEach(node => {
    const geneCount = node.data.geneCount
    if(geneCount !== undefined) {
      const labelSize = labelSizeMapper(geneCount)
      node.data['labelSize'] = labelSize
    } else {
      node.data['labelSize'] = 6
    }
  })

  return network
}


export const DELETE_NETWORK = 'DELETE_NETWORK'
const deleteNetwork = url => {
  return {
    type: DELETE_NETWORK,
    url
  }
}
