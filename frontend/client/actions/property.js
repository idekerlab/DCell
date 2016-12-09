import {Client} from 'elasticsearch'

const client = new Client({
  host: 'localhost:9200',
  log: 'trace'
});



export const FETCH_PROPERTY = 'FETCH_PROPERTY'
const fetchProperty = id => {
  return {
    type: FETCH_PROPERTY,
    id
  }
}


export const RECEIVE_PROPERTY = 'RECEIVE_PROPERTY'
const receiveProperty = (id, json) => {

  console.log("*** Fetch Result ***")
  console.log(json)

  return {
    type: RECEIVE_PROPERTY,
    id,
    data: json
  }
}

const fetchProp = id => {
  return client.get({
    index: 'terms',
    type: 'go_term',
    id: id
  })
}

export const fetchEntry = id => {

  return dispatch => {
    dispatch(fetchProperty(id))

    return fetchProp(id)
      .then(json =>
        dispatch(receiveProperty(id, json))
      )
  }
}
