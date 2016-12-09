import {Client} from 'elasticsearch'

const client = new Client({
  host: 'localhost:9200',
  log: 'trace'
});


export const SEARCH = 'SEARCH'
const search = query => {
  return {
    type: SEARCH,
    query
  }
}


export const RECEIVE_SEARCH_RESULT = 'RECEIVE_SEARCH_RESULT'
const receiveSearchResult = (query, json) => {

  console.log("*** Result ***")
  console.log(json)

  return {
    type: RECEIVE_SEARCH_RESULT,
    query,
    result: json
  }
}

const sendQuery = (query) => {
  return client.search({
    index: 'genes',
    type: 'gene',
    body: {
      query: {
        match: {
          _all: query
        }
      }
    }
  })
}

export const searchDatabase = query => {

  return dispatch => {
    dispatch(search(query))

    return sendQuery(query)
      .then(json =>
        dispatch(receiveSearchResult(query, json))
      )
  }
}


