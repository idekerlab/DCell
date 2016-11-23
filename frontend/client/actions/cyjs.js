import { createAction } from 'redux-actions'

export const SELECTED = 'SELECTED'
export const UNSELECTED = 'UNSELECTED'

export const selected = createAction(SELECTED)
export const unselected = createAction(UNSELECTED)
