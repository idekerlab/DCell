import {SEARCH, RECEIVE_SEARCH_RESULT, CLEAR_SEARCH_RESULT} from '../actions/search'

const defaultState = {
  query: null,
  result: null,
  loading: false
}


export default function searchState(state = defaultState, action) {

  switch (action.type) {
    case SEARCH:
      console.log('+++++++++++++++ SEARCH@@@@ ++++++++++++++')
      console.log(action)

      return {
        query: action.query,
        result: null,
        loading: true
      }
    case RECEIVE_SEARCH_RESULT:
      console.log('+++++++++++++++ GOT RESULT@@@ ++++++++++++++')
      console.log(action)

      return {
        query: action.query,
        result: action.result,
        loading: false
      }
    case CLEAR_SEARCH_RESULT:
      console.log('+++++++++++++++ CLEAR SEARCH called @@@ ++++++++++++++')
      console.log(action)

      return defaultState
    default:
      return state
  }
}
