import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as networkSourceActions from '../../reducers/currentnetwork'
import * as commandActions from '../../actions/commands'
import * as eventActions from '../../actions/cyjs'
import * as uiStateActions from '../../actions/ui-state'
import * as vsActions from '../../reducers/visualstyles'
import * as currentVsActions from '../../reducers/currentvs'

import * as currentNetworkActions from '../../reducers/currentnetwork'

import NetworkViewer from '../../components/NetworkViewer'

import * as propertyActions from '../../actions/property'
import * as searchActions from '../../actions/search'

import * as networkActions from '../../actions/network'

import {blueGrey50, grey800} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import * as queryGenesActions from '../../actions/query-genes'

import * as messageActions from '../../actions/message'


import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()


// Theme settings
const muiTheme = getMuiTheme({
  appBar: {
    color: grey800
  },
  snackbar:{
    textColor: 'white',
    actionColor: '#555555'
  }
})


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
        />
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentNetwork: state.app_manager.current_network,
    currentProperty: state.app_manager.current_property,
    search: state.app_manager.search,
    commands: state.app_manager.commands,
    events: state.app_manager.cy_events,
    uiState: state.app_manager.ui_state,
    styles: state.visual_styles,
    currentVs: state.app_manager.current_vs,
    datasource: state.app_manager.datasource,

    network: state.network,
    config: state.config,

    queryGenes: state.app_manager.query_genes,
    message: state.app_manager.message

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

    currentNetworkActions: bindActionCreators(currentNetworkActions, dispatch),

    propertyActions: bindActionCreators(propertyActions, dispatch),
    searchActions: bindActionCreators(searchActions, dispatch),

    queryGenesActions: bindActionCreators(queryGenesActions, dispatch),

    messageActions: bindActionCreators(messageActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NetworkView)
