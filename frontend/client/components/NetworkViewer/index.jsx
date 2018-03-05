import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import NetworkPanel from '../NetworkPanel'
import PropertyPanel from '../PropertyPanel'
import Errorbar from 'material-ui/Snackbar';
import SearchPanel from '../SearchPanel'
import RunningOverlay from '../RunningOverlay'

import Commands from '../Commands'

import style from './style.css'
import SubTreePanel from '../SubTreePanel'
import MessagePanel from '../MessagePanel'

import AppBar from 'material-ui/AppBar';

import TreeTitleBar from '../TreeTitleBar'

import ErrorDialog from '../ErrorDialog'


const containerStyle = {
  display: 'flex',
  height: '100%',
  width: '100%'
}

export default class NetworkViewer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      autoHideDuration: 1000000,
      open: false,
      openErrorDialog: false,
      errorMessage: ''
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

  openDialogAction = (open, message) => {
    this.setState({
      openErrorDialog: open,
      errorMessage: message
    });
  };

  componentWillReceiveProps(nextProps) {
    const error = nextProps.queryGenes.get('error')
    const runLast = this.props.queryGenes.get('running')
    const run = nextProps.queryGenes.get('running')

    if (error !== null && runLast === true && run === false) {
      if (error.includes('Input Error')) {
        this.openDialogAction(true, 'Invalid input parameters.')
      } else {
        this.openDialogAction(true, 'Simulator is running other jobs.  Please try again later.')
      }
    }
  }

  render() {

    const {
      networks,
      networkActions,
      commands, commandActions,
      events, eventActions, networkId, uiState, uiStateActions,
      styles, currentVs, currentVsActions, backgroundColorActions,
      backgroundColor, vsActions, datasource, currentProperty, propertyActions,
      searchActions, search, network, config, message, messageActions

    } = this.props

    let errorMsg = null
    if (errorMsg === null || errorMsg === undefined) {
      errorMsg = 'N/A'
    } else {
      errorMsg = 'ERROR: ' + errorMsg
    }


    const running = this.props.queryGenes.get('running')
    const genes = this.props.queryGenes.get('genes')
    const result = this.props.queryGenes.get('result')

    return (

      <div style={this.props.style}>
        <TreeTitleBar
          result={result}
          genes={genes}
        />

        <ErrorDialog
          openDialog={this.state.openErrorDialog}
          openDialogAction={this.openDialogAction}
          errorMessage={this.state.errorMessage}
        />

        <div style={containerStyle}>
          <SearchPanel
            search={search}
            searchActions={searchActions}
            uiStateActions={uiStateActions}
            commandActions={commandActions}

            backendServices={config.get('backendServices').toJS()}
            trees={config.get('trees').toJS()}
            currentNetwork={this.props.currentNetwork.toJS()}

            queryGenesActions={this.props.queryGenesActions}
            queryGenes={this.props.queryGenes}

            uiState={uiState}

            currentNetworkActions={this.props.currentNetworkActions}
            propertyActions={this.props.propertyActions}
          />

          <SubTreePanel
            uiState={uiState}
            uiStateActions={uiStateActions}
            queryGenesActions={this.props.queryGenesActions}
            queryGenes={this.props.queryGenes}
          />

        </div>
        {
          running ?
            <RunningOverlay/> : <div></div>
        }

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
