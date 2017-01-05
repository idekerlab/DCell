import {routerReducer as routing} from 'react-router-redux'
import {combineReducers} from 'redux'
import currentNetwork from './currentnetwork'
import current_vs from './currentvs'
import visual_styles from './visualstyles'
import cy_commands from './cycommands'
import cy_events from './cy-events'
import ui_state from './ui-state'
import datasource from './datasource'
import property from './property'

import search from './search'
import network from './network'

import ontologies from './ontologies'
import config from './config'

// Application states
const app_manager = combineReducers({
  current_vs: current_vs,
  current_network: currentNetwork,
  current_property: property,

  commands: cy_commands,
  cy_events: cy_events,
  ui_state: ui_state,
  datasource: datasource,
  search: search,
})


export default combineReducers({
    routing,
    app_manager,
    visual_styles,
    network,
    ontologies,
    config
  }
)