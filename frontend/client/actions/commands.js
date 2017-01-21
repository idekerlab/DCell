import { createAction } from 'redux-actions'

export const FIT_NETWORK = 'FIT_NETWORK'
export const ZOOM_IN_NETWORK = 'ZOOM_IN_NETWORK'
export const ZOOM_OUT_NETWORK = 'ZOOM_OUT_NETWORK'
export const RESET = 'RESET'

export const FIND_PATH = 'FIND_PATH'
export const SELECT = 'SELECT'
export const FOCUS = 'FOCUS'
export const FILTER = 'FILTER'


export const fit = createAction(FIT_NETWORK)
export const zoomIn = createAction(ZOOM_IN_NETWORK)
export const zoomOut = createAction(ZOOM_OUT_NETWORK)
export const reset = createAction(RESET)
export const findPath = createAction(FIND_PATH)
export const select = createAction(SELECT)
export const focus = createAction(FOCUS)
export const filter = createAction(FILTER)
