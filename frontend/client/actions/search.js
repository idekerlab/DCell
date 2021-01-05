export const SEARCH = 'SEARCH'
const search = (query, options) => {
  return {
    type: SEARCH,
    query,
    options
  }
}


export const RECEIVE_SEARCH_RESULT = 'RECEIVE_SEARCH_RESULT'
const receiveSearchResult = (query, json, searchType, options) => {
  return {
    type: RECEIVE_SEARCH_RESULT,
    query,
    options,
    searchType,
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

  const obj = {
    query
  };
  const method = "POST";
  const body = JSON.stringify(obj);
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  return fetch("http://d-cell-dev.ucsd.edu:3001/search", {method, headers, body})
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
      .then((res)=> res.json())
      .then(json =>
        dispatch(receiveSearchResult(query, json, options.index))
      )
  }
}


