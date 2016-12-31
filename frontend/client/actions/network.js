export const FETCH_NETWORK = 'FETCH_NETWORK'
const fetchNetwork = url => {
  return {
    type: FETCH_NETWORK,
    url
  }
}


export const RECEIVE_NETWORK = 'RECEIVE_NETWORK'
const receiveNetwork = (url, json) => {

  console.log("*** Network Fetch Result ***")
  console.log(json)

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
      .then(json =>
        dispatch(receiveNetwork(url, json))
      )
  }
}

export const DELETE_NETWORK = 'DELETE_NETWORK'
const deleteNetwork = url => {
  return {
    type: DELETE_NETWORK,
    url
  }
}
