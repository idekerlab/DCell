import {FETCH_NETWORK, RECEIVE_NETWORK, DELETE_NETWORK} from '../actions/network'
import {Map} from 'immutable'

const defState = Map({})


export default function networkState(state = defState, action) {

  switch (action.type) {
    case FETCH_NETWORK:
      console.log('+++++++++++++++ Net Fetch 2 ++++++++++++++')
      return state.set('loading', action.url);
    case RECEIVE_NETWORK:
      console.log('+++++++++++++++ Net Fetch finished ++++++++++++++')
      return state.set(action.url, action.network)
    case DELETE_NETWORK:
      return state.delete(action.url)
    default:
      return state
  }
}
