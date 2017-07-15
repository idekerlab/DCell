import {Client} from 'elasticsearch'
import config from '../assets/config.json'

const client = new Client({
  host: config.backendServices.db,
  log: 'info'
});

const DEF_OPTIONS = {
  index: 'genes',
  type: 'gene'
}


export const SEARCH = 'SEARCH'
const search = (query, options) => {
  return {
    type: SEARCH,
    query,
    options
  }
}


export const RECEIVE_SEARCH_RESULT = 'RECEIVE_SEARCH_RESULT'
const receiveSearchResult = (query, json, options) => {

  return {
    type: RECEIVE_SEARCH_RESULT,
    query,
    options,
    result: json
  }
}


export const CLEAR_SEARCH_RESULT = 'CLEAR_SEARCH_RESULT'
const clearSearchResult = () => {
  return {
    type: CLEAR_SEARCH_RESULT,
    result: {}
  }
}


const sendQuery = (query, options) => {
  let opt = options

  if(options === undefined || options === null) {
    opt = DEF_OPTIONS
  }

  return client.search({
    index: opt.index,
    type: opt.type,
    size: 50,
    body: {
      query: {
        match: {
          _all: query
        }
      }
    }
  })
}



export const clear = () => {
  return dispatch => {
    dispatch(clearSearchResult())
  }
}

export const searchDatabase = (query, options) => {

  return dispatch => {
    dispatch(search(query, options))

    return sendQuery(query, options)
      .then(json =>
        dispatch(receiveSearchResult(query, json))
      )
  }
}


