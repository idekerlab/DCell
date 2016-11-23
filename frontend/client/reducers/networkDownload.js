import {Map} from 'immutable'
import 'whatwg-fetch'

import {addNetwork} from './networks'

const HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

const DOWNLOAD_BEGIN = 'DOWNLOAD_BEGIN'
const DOWNLOAD_SUCCESS = 'DOWNLOAD_SUCCESS'
const DOWNLOAD_ERROR = 'DOWNLOAD_ERROR'

const defaultState = Map({
  downloading: false,
  error: null
})

export default function downloadState(state = defaultState, action) {
  switch (action.type) {
    case DOWNLOAD_BEGIN:
      return state.merge({
        downloading: true,
        error: null
      })
    case DOWNLOAD_SUCCESS:
      return state.merge({
        downloading: false
      })
    case DOWNLOAD_ERROR:
      console.log('! err2')
      console.log(action.error)
      const err = action.error

      return state.merge({
        downloading: false,
        error: err.toString()
      })
    default:
      return state
  }
}

/*Set the downloading flag*/
export function downloadBegin() {
  return {type: DOWNLOAD_BEGIN}
}

/*Send network to the networks store and remove the downloading flag*/
export function downloadSuccess(networkUrl, data) {
  return dispatch => {
    dispatch(addNetwork(networkUrl, data))
    dispatch({type: DOWNLOAD_SUCCESS})
  }
}

/*Set an error field if a download did not complete successfully*/
export function downloadError(error) {
  return {
    type: DOWNLOAD_ERROR,
    error: error
  }
}

/*Download the network from the given url*/
export function download(networkUrl) {
  return dispatch =>
    fetch(networkUrl, {
      method: 'get',
      headers: HEADERS
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        response.json().then((data) => dispatch(downloadSuccess(networkUrl, data)))
      } else {
        const error = new Error(response)
        error.response = response
        dispatch(downloadError(error))
        throw error
      }
    }).catch(error => {
      console.log('*********ERR!!!!!!!!!!!!!!!')
      console.log(error)
      dispatch(downloadError(error))
    })
}

export const fetchNetwork = url => {
  return dispatch =>
  fetch(url)
    .then(response => (response.json()))
    .then(network => {
      console.log("OK!!!!!!!!!!!!!")
      console.log(network)
      dispatch(downloadSuccess(url, network))
    });
}
