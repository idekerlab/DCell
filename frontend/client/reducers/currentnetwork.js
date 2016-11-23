import { Map, Set } from 'immutable'

const SET_CURRENT_NETWORK = 'SET_CURRENT_NETWORK'

const defaultState = Map({
  url: '',
  type: ''
})

export default function currentNetworkState(state = defaultState, action) {
  switch (action.type) {
    case SET_CURRENT_NETWORK:
      return state.set('url', action.networkUrl)
    default:
      return state
  }
}

export function setCurrentNetwork(networkUrl) {
  return {
    type: SET_CURRENT_NETWORK,
    networkUrl: networkUrl
  }
}
