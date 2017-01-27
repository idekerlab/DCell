import {handleActions} from 'redux-actions'
import {Map} from 'immutable'

const defaultState = Map({
  message: 'Initializing application.  Please be patient...'
})

export default handleActions({
  SET_MESSAGE: (state, action) => (Map({
    message: action.payload
  })),
}, defaultState)
