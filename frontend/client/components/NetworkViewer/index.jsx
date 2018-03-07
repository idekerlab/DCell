import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import SearchPanel from '../SearchPanel'
import SubTreePanel from '../SubTreePanel'
import TreeTitleBar from '../TreeTitleBar'

export default class NetworkViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      autoHideDuration: 1000000,
      open: false,
      openErrorDialog: false,
      errorMessage: ''
    }
  }

  handleActionTouchTap = () => {
    this.setState({
      open: false
    })
    browserHistory.push('/')
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    })
  }

  openDialogAction = (open, message) => {
    this.setState({
      openErrorDialog: open,
      errorMessage: message
    })
  }

  componentWillReceiveProps(nextProps) {
    const error = nextProps.queryGenes.get('error')
    const runLast = this.props.queryGenes.get('running')
    const run = nextProps.queryGenes.get('running')

    if (error !== null && runLast === true && run === false) {
      if (error.includes('Input Error')) {
        this.openDialogAction(true, 'Invalid input parameters.')
      } else {
        this.openDialogAction(
          true,
          'Simulator is running other jobs.  Please try again later.'
        )
      }
    }
  }

  render() {
    const {
      commandActions,
      uiState,
      uiStateActions,
      searchActions,
      search,
      config
    } = this.props

    const outerContainerStyle = {
      zIndex: 0,
      margin: 0,
      padding: 0,
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#FFFFFF'
    }

    const containerStyle = {
      display: 'flex',
      height: '100%',
      width: '100%',
      flexGrow: 2
    }

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
      <div style={outerContainerStyle}>

        <TreeTitleBar result={result} genes={genes} />

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
      </div>
    )
  }
}
