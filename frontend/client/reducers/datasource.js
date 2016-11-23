import {handleActions} from 'redux-actions'
import {Map} from 'immutable'

const defaultState = Map({
  networkUrl: null,
  styleUrl: null
})


export default handleActions({
  SET_NETWORK_SOURCE: (state, action) => (
    state.set('networkUrl', action.payload)
  ),
  SET_STYLE_SOURCE: (state, action) => (
    state.set('styleUrl', action.payload)
  )
}, defaultState)


