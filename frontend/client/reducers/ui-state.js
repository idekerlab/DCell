import {handleActions} from 'redux-actions'
import {Map} from 'immutable'

// Application state reducer

const defaultState = Map({
  showAppBar: true,
  showCommands: true,
  showResult: false,
  showSearchWindow: true,
  showRunning: false
})

export default handleActions({
  SHOW_APP_BAR: (state, action) => (
    state.set('showAppBar', action.payload)
  ),
  SHOW_RUNNING: (state, action) => (
    state.set('showRunning', action.payload)
  ),
  SHOW_COMMANDS: (state, action) => (
    state.set('showCommands', action.payload)
  ),
  SHOW_RESULT: (state, action) => (
    state.set('showResult', action.payload)
  ),
  SHOW_SEARCH_WINDOW: (state, action) => (
    state.set('showSearchWindow', action.payload)
  ),
}, defaultState)

