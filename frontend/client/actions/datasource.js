import { createAction } from 'redux-actions'

export const SET_NETWORK_SOURCE = 'SET_NETWORK_SOURCE'
export const SET_STYLE_SOURCE = 'SET_STYLE_SOURCE'

export const setNetworkSource = createAction(SET_NETWORK_SOURCE)
export const setStyleSource = createAction(SET_STYLE_SOURCE)
