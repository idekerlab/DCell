import { Map } from 'immutable'

const SET_CURRENT_VS = 'SET_CURRENT_VS'

const defaultState = Map({
  vsName: 'default'
})

export default function currentVisualStyleState(state = defaultState, action) {

  switch (action.type) {
    case SET_CURRENT_VS:
      return state.set('vsName', action.vsName)
    default:
      return state
  }
}

export function setCurrentVs(vsName) {
  return {
    type: SET_CURRENT_VS,
    vsName: vsName
  }
}

