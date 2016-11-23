import {handleActions} from 'redux-actions'
import {Map} from 'immutable'

const defaultState = Map({
  selected: null
})

export default handleActions({
  SELECTED: (state, action) => (
    state.set('selected', action.payload)
  ),
  UNSELECTED: (state, action) => (
    state.set('selected', null)
  )

}, defaultState)
