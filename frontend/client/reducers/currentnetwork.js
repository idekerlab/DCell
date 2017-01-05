import {Map} from 'immutable'
import config from '../assets/config.json'


const defaultNetwork = config.defaultNetwork

const SET_CURRENT_NETWORK = 'SET_CURRENT_NETWORK'



const defaultState = Map({
  id: defaultNetwork
})

export default function currentNetworkState(state = defaultState, action) {
  switch (action.type) {
    case SET_CURRENT_NETWORK:
      return state.set('id', action.id)
    default:
      return state
  }
}

export const setCurrentNetwork = id => {
  return {
    type: SET_CURRENT_NETWORK,
    id
  }
}
