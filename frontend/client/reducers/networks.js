import {Map} from 'immutable'

const ADD_NETWORK = 'ADD_NETWORK'
const DELETE_NETWORK = 'DELETE_NETWORK'

const defaultState = Map({})

export default function networkStore(state = defaultState, action) {
  switch (action.type) {
    case ADD_NETWORK:
      return state.set(action.networkId, Map(action.data))
    case DELETE_NETWORK:
      return state.delete(action.networkId)
    default:
      return state
  }
}

export function addNetwork(networkId, data) {
  return {
    type: ADD_NETWORK,
    networkId,
    data
  }
}

export function deleteNetwork(networkId) {
  return {
    type: DELETE_NETWORK,
    networkId
  }
}


