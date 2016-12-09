import {FETCH_PROPERTY, RECEIVE_PROPERTY} from '../actions/property'


const defaultState = {
  id: null,
  data: {}
}



export default function currentPropertyState(state = defaultState, action) {

  switch (action.type) {
    case FETCH_PROPERTY:
      console.log('+++++++++++++++ Fetch 1 ++++++++++++++')
      return {
        id: action.id,
        data: {}
      }
    case RECEIVE_PROPERTY:
      console.log('+++++++++++++++ Fetch finished3 ++++++++++++++')
      console.log(action)

      return {
        id: action.id,
        data: action.data
      }
    default:
      return state
  }
}

