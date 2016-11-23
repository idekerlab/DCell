import {routerReducer as routing} from 'react-router-redux'
import {combineReducers} from 'redux'
import currentNetwork from './currentnetwork'
import current_vs from './currentvs'
import visual_styles from './visualstyles'
import cy_commands from './cycommands'
import cy_events from './cy-events'
import ui_state from './ui-state'
import background_color from './background-color'
import datasource from './datasource'

import networks from './networks'
import networkDownload from './networkDownload'

// Cytoscape.js network data store
const cy_network = combineReducers({networks, networkDownload})

// Application states
const app_manager = combineReducers({
  current_vs: current_vs,
  current_network: currentNetwork,
  commands: cy_commands,
  cy_events: cy_events,
  ui_state: ui_state,
  background_color: background_color,
  datasource: datasource
})


export default combineReducers({
    routing,
    app_manager,
    visual_styles,
    cy_network
  }
)