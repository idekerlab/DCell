import {FETCH_NETWORK, RECEIVE_NETWORK} from '../actions/network'

const defaultState = {
  url: null,
  network: {}
}


export default function networkState(state = defaultState, action) {

  switch (action.type) {
    case FETCH_NETWORK:
      console.log('+++++++++++++++ Net Fetch 1 ++++++++++++++')
      return {
        url: action.url,
        network: {}
      }
    case RECEIVE_NETWORK:
      console.log('+++++++++++++++ Net Fetch finished ++++++++++++++')
      console.log(action)

      return {
        url: action.url,
        network: action.network
      }
    default:
      return state
  }
}


