import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import classnames from 'classnames'

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Settings from 'material-ui/svg-icons/action/settings'
import HomeIcon from 'material-ui/svg-icons/action/home'

import HelpIcon from 'material-ui/svg-icons/action/help-outline';
import Toggle from 'material-ui/Toggle';

import style from './style.css'
import logo from '../../assets/images/cytoscape-logo-orange.svg'


// TODO: Split into smaller sub-menus
export default class MainMenu extends Component {

  handleHome = event => {
    window.location.href = '/'
  }

  handleHelp = event => {
    window.location.href = 'https://github.com/idekerlab/deep-cell/wiki'
  }

  handleShowCommands = event => {
    const switched = this.refs.commands.state.switched
    this.props.uiStateActions.showCommands(!switched)
  }

  handleShowAppBar = event => {
    const switched = this.refs.appBar.state.switched
    this.props.uiStateActions.showAppBar(!switched)
  }

  handleShowSearchWindow = event => {
    const switched = this.refs.searchWindow.state.switched
    this.props.uiStateActions.showSearchWindow(!switched)
  }

  extractNdexData(cxData) {
    const provenanceHistory = cxData.provenanceHistory

    if (provenanceHistory === undefined || provenanceHistory === null) {
      return []
    }

    const entity = provenanceHistory[0].entity
    if (entity === undefined || entity === null) {
      return []
    }

    const properties = entity.properties
    if (properties === undefined || properties === null) {
      return []
    }

    return properties
  }


  render() {
    let url = this.props.networkId
    let network = undefined

    if (url === undefined || url === null || url === '') {
      // URL is not available
      url = ''
    } else {
      network = this.props.networks.get(url)
    }

    let name = 'N/A'
    let ndexMetadata = []
    if (network !== undefined) {
      // Case 1: NDEx network
      const ndexProps = network.get('cxData')
      if (ndexProps !== undefined) {
        ndexMetadata = this.extractNdexData(ndexProps)
      }

      const data = network.get('data')
      if (data !== undefined) {
      }
    }

    const uiState = this.props.uiState
    const showAppBar = uiState.get('showAppBar')
    const showCommands = uiState.get('showCommands')
    const showSearchWindow = uiState.get('showSearchWindow')

    const styles = this.props.styles
    const {currentVsActions, backgroundColorActions,
      backgroundColor, currentVs} = this.props

    return (
      <div>
        <div className={classnames(style.grid, style.top)}>
          <img
            className={style.icon}
            src={logo}
          />
          <h1 className={style.title}>
            DeepCell v1.0
          </h1>
        </div>


        <Divider />


        <List>
          <ListItem
            key={1}
            primaryText="Settings"
            leftIcon={<Settings />}
            initiallyOpen={true}
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem
                key={1}
                primaryText="Navigation buttons"
                rightToggle={
                  <Toggle
                    ref="commands"
                    toggled={showCommands}
                    onToggle={this.handleShowCommands}
                  />
                }
              />,
              <ListItem
                key={2}
                primaryText="Toolbar"
                rightToggle={
                  <Toggle
                    ref="appBar"
                    toggled={showAppBar}
                    onToggle={this.handleShowAppBar}
                  />
                }
              />,
              <ListItem
              key={3}
              primaryText="Search Window"
              rightToggle={
              <Toggle
                ref="searchWindow"
                toggled={showSearchWindow}
                onToggle={this.handleShowSearchWindow}
              />
            }
              />
            ]}
          />
        </List>

        <Divider />

        <List>
          <ListItem
            primaryText="Help"
            leftIcon={<HelpIcon />}
            onTouchTap={this.handleHelp}
          />
          <ListItem
            primaryText="Back to home"
            leftIcon={<HomeIcon />}
            onTouchTap={this.handleHome}
          />
        </List>
      </div>

    )
  }
}
