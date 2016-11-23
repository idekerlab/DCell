import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import classnames from 'classnames'

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Settings from 'material-ui/svg-icons/action/settings'
import HomeIcon from 'material-ui/svg-icons/action/home'
import StyleIcon from 'material-ui/svg-icons/image/color-lens'
import StyleSelectorIcon from 'material-ui/svg-icons/image/style'
import Avatar from 'material-ui/Avatar'

import HelpIcon from 'material-ui/svg-icons/action/help-outline';
import Toggle from 'material-ui/Toggle';

import StyleSelector from '../StyleSelector'
import NetworkSelector from '../NetworkSelector'

import style from './style.css'
import logo from '../../assets/images/cytoscape-logo-orange.svg'


// TODO: Split into smaller sub-menus
export default class MainMenu extends Component {

  handleHome = event => {
    browserHistory.push('/')
  }

  handleShowCommands = event => {
    const switched = this.refs.commands.state.switched
    this.props.uiStateActions.showCommands(!switched)
  }

  handleShowAppBar = event => {
    const switched = this.refs.appBar.state.switched
    this.props.uiStateActions.showAppBar(!switched)
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
            Ontology Viewer <i>&beta;</i>
          </h1>
        </div>

        <NetworkSelector

        />

        <List>
          {
            ndexMetadata.map(keyVal => {
              return <ListItem
                secondaryText={keyVal['name']}
                primaryText={keyVal['value']}
              />
            })
          }
        </List>

        <Divider />

        <List>
          <ListItem
            key={1}
            primaryText="Style"
            leftIcon={<StyleIcon />}
            initiallyOpen={true}
            primaryTogglesNestedList={true}
            nestedItems={[

              <ListItem
                key={2}
              >
                <StyleSelector
                  styles={styles}
                  currentVs={currentVs}
                  currentVsActions={currentVsActions}
                />
              </ListItem>
            ]}
          />
        </List>

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
              />
            ]}
          />
        </List>

        <Divider />

        <List>
          <ListItem
            primaryText="Help"
            leftIcon={<HelpIcon />}
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
