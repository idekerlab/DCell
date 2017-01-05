import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import ClosableAppBar from '../ClosableAppBar'
import NetworkPanel from '../NetworkPanel'
import PropertyPanel from '../PropertyPanel'
import Errorbar from 'material-ui/Snackbar';
import SearchPanel from '../SearchPanel'

import Commands from '../Commands'

import style from './style.css'
import SubTreePanel from '../SubTreePanel'



export default class NetworkViewer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      autoHideDuration: 1000000,
      open: false,
    };
  }

  handleActionTouchTap = () => {
    this.setState({
      open: false,
    });
    browserHistory.push('/')
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  componentWillReceiveProps(nextProps) {
  }

  render() {

    const {
      networks,
      networkActions,
      commands, commandActions,
      events, eventActions, networkId, uiState, uiStateActions,
      styles, currentVs, currentVsActions, backgroundColorActions,
      backgroundColor, vsActions, datasource, currentProperty, propertyActions,
      searchActions, search, network, config

    } = this.props

    let errorMsg = null
    if(errorMsg === null || errorMsg === undefined) {
      errorMsg = 'N/A'
    } else {
      errorMsg = 'ERROR: ' + errorMsg
    }


    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ UI")
    console.log(this.props)

    return (

      <div style={this.props.style}>
        <ClosableAppBar
          networkId={networkId}
          networks={networks}
          uiState={uiState}
          uiStateActions={uiStateActions}
          styles={styles}
          currentVsActions={currentVsActions}
          currentVs={currentVs}
          backgroundColorActions={backgroundColorActions}
          backgroundColor={backgroundColor}
          datasource={datasource}
          trees={config.get('trees').toJS()}
          currentNetwork={this.props.currentNetwork.toJS()}
          currentNetworkActions={this.props.currentNetworkActions}
        />

        <NetworkPanel
          networks={networks}
          networkActions={networkActions}
          commands={commands}
          commandActions={commandActions}
          events={events}
          eventActions={eventActions}
          networkId={networkId}
          styles={styles}
          currentVs={currentVs}
          currentVsActions={currentVsActions}
          backgroundColor={backgroundColor}
          vsActions={vsActions}
          currentProperty={currentProperty}
          propertyActions={propertyActions}

          network={network}
          search={search}

          trees={config.get('trees').toJS()}
          currentNetwork={this.props.currentNetwork.toJS()}
        />

        <Commands
          commandActions={commandActions}
          uiState={uiState}
        />

        <SearchPanel
          search={search}
          searchActions={searchActions}
          uiStateActions={uiStateActions}
          commandActions={commandActions}
        />

        <PropertyPanel
          events={events}
          currentProperty={currentProperty}
        />

        {uiState.get('showResult') ? <SubTreePanel uiStateActions={uiStateActions}/> : <div></div>}

        <Errorbar
          className={style.errorbar}
          open={this.state.open}
          message={errorMsg}
          action='Back'
          bodyStyle={{
            backgroundColor: 'rgba(0,0,0,0)',
            fontWeight: 700,
          }}
          autoHideDuration={this.state.autoHideDuration}
          onActionTouchTap={this.handleActionTouchTap}
          onRequestClose={this.handleRequestClose}
        />

      </div>
    )
  }
}
