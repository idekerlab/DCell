import {Map} from 'immutable'

const defaultState = {
  id: null,
  properties: null
}



export default function currentPropertyState(state = defaultState, action) {

  switch (action.type) {
    case 'SET_PROPERTY':
      console.log('+++++++++++++++ Set prop2 ++++++++++++++')
      return {
        id: action.id,
        properties: action.property
      }
    default:
      return state
  }
}

