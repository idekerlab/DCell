import { createAction } from 'redux-actions'

export const SHOW_APP_BAR = 'SHOW_APP_BAR'
export const SHOW_COMMANDS = 'SHOW_COMMANDS'
export const SHOW_RESULT = 'SHOW_RESULT'

export const showAppBar = createAction(SHOW_APP_BAR)
export const showCommands = createAction(SHOW_COMMANDS)
export const showResult = createAction(SHOW_RESULT)
