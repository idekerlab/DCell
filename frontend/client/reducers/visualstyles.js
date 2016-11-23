import {Map} from 'immutable'
import 'whatwg-fetch'

const LOAD_VS = 'LOAD_VS'
const ADD_ALL_VS = 'ADD_ALL_VS'
const ADD_VS = 'ADD_VS'
const REMOVE_VS = 'REMOVE_VS'
const REMOVE_ALL_VS = 'REMOVE_ALL_VS'

const defaultState = Map({
  default: []
})


export default function visualStyleState(state = defaultState, action) {

  switch (action.type) {
    case ADD_ALL_VS:
      return Map(action.styles)
    case ADD_VS:
      return state.set(action.vsName, action.style)
    case REMOVE_VS:
      return state.delete(action.vsName)
    case REMOVE_ALL_VS:
      return defaultState
    default:
      return state
  }
}

export function fetchVisualStyles(url) {

  return dispatch => fetch(url)
    .then(res => {
      return res.json()
    })
    .then(payload => {
      const styleMap = {}
      payload.map(vs => {
        styleMap[vs.title] = vs.style
      })
      return dispatch(addStyles(styleMap))
    })
    .catch(error => { error });
}


export function addStyles(styles) {
  return {
    type: ADD_ALL_VS,
    styles: styles,
  }
}

export function addStyle(vsName, style) {
  return {
    type: ADD_VS,
    vsName: vsName,
    style: style
  }
}

export function removeVs(vsName) {
  return {
    type: REMOVE_VS,
    vsName: vsName
  }
}

export function removeAllVs() {
  return {
    type: REMOVE_ALL_VS
  }
}


