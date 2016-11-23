import { Map } from 'immutable'

const SET_COMMAND = 'SET_COMMAND'

const defaultState = Map({
  command: '',
  parameters: {}
})

export default function commandState(state = defaultState, action) {

  switch (action.type) {
    case SET_COMMAND:
      return state.set('command', action)
    default:
      return state
  }
}


export function setCommand(command) {
  return {
    type: SET_COMMAND,
    command: command
  }
}


