import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as networkSourceActions from '../../reducers/currentnetwork'
import * as commandActions from '../../actions/commands'
import * as eventActions from '../../actions/cyjs'
import * as uiStateActions from '../../actions/ui-state'
import * as vsActions from '../../reducers/visualstyles'
import * as currentVsActions from '../../reducers/currentvs'
import * as backgroundColorActions from '../../actions/background-color'

import NetworkViewer from '../../components/NetworkViewer'

import * as propertyActions from '../../actions/property'
import * as searchActions from '../../actions/search'

// import * as networkActions from '../../reducers/networks'
import * as networkActions from '../../actions/network'

import {grey50, grey800} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


// Theme settings
const muiTheme = getMuiTheme({
  appBar: {
    color: grey800,
  },
  snackbar:{
    textColor: 'white',
    actionColor: '#555555'
  }
})

const baseStyle = {
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 0,
  background: grey50,
  height: '100%',
  width: '100%'
}

/**
 * Base component for the network viewer page.
 */
class NetworkView extends Component {

  render() {
    const networkId = this.props.params.uri

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <NetworkViewer
          {...this.props}
          networkId={networkId}
          style={baseStyle}
        />
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    networks: state.cy_network.networks,
    currentNetwork: state.app_manager.current_network,
    currentProperty: state.app_manager.current_property,
    search: state.app_manager.search,
    commands: state.app_manager.commands,
    events: state.app_manager.cy_events,
    uiState: state.app_manager.ui_state,
    styles: state.visual_styles,
    currentVs: state.app_manager.current_vs,
    backgroundColor: state.app_manager.background_color,
    datasource: state.app_manager.datasource,

    network: state.app_manager.network
  }
}

function mapDispatchToProps(dispatch) {
  return {
    networkActions: bindActionCreators(networkActions, dispatch),
    networkSourceActions: bindActionCreators(networkSourceActions, dispatch),
    commandActions: bindActionCreators(commandActions, dispatch),
    eventActions: bindActionCreators(eventActions, dispatch),
    uiStateActions: bindActionCreators(uiStateActions, dispatch),
    vsActions: bindActionCreators(vsActions, dispatch),
    currentVsActions: bindActionCreators(currentVsActions, dispatch),
    backgroundColorActions: bindActionCreators(backgroundColorActions, dispatch),

    propertyActions: bindActionCreators(propertyActions, dispatch),
    searchActions: bindActionCreators(searchActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NetworkView)
