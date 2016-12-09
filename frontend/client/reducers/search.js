import {SEARCH, RECEIVE_SEARCH_RESULT} from '../actions/search'

const defaultState = {
  query: null,
  result: null
}


export default function searchState(state = defaultState, action) {

  switch (action.type) {
    case SEARCH:
      console.log('+++++++++++++++ SEARCH@@@@ ++++++++++++++')
      console.log(action)

      return {
        query: action.query,
        result: null
      }
    case RECEIVE_SEARCH_RESULT:
      console.log('+++++++++++++++ GOT RESULT@@@ ++++++++++++++')
      console.log(action)

      return {
        query: action.query,
        result: action.result
      }
    default:
      return state
  }
}
