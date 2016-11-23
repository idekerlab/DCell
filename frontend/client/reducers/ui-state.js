import {handleActions} from 'redux-actions'
import {Map} from 'immutable'

// Application state reducer

const defaultState = Map({
  showAppBar: true,
  showCommands: true
})

export default handleActions({
  SHOW_APP_BAR: (state, action) => (
    state.set('showAppBar', action.payload)
  ),
  SHOW_COMMANDS: (state, action) => (
    state.set('showCommands', action.payload)
  ),
}, defaultState)

