import Immutable, { Map } from 'immutable'
import config from '../assets/config.json'


const defaultState = Immutable.fromJS(config)


export default function configState(state = defaultState, action) {

  // Immutable default state
  switch (action.type) {
    default:
      return state
  }
}


