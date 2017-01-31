import React, {Component} from 'react'

import MainMenu from '../MainMenu'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

import Drawer from 'material-ui/Drawer'

import style from './style.css'
import classnames from 'classnames'


import NetworkSelector from '../NetworkSelector'


const dStyle = {
  padding: 10,
}


export default class ClosableAppBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      shareDialogOpen: false,
      network: 1
    }
  }

  openMenu = () => {
    this.setState({open: !this.state.open})
  }


  handleChange = (event, index, value) => this.setState({network: value});


  getBar = () => {
    const show = this.props.uiState.get('showAppBar')

    if (!show) {

      return (
        <IconButton
          style={{zIndex: 800}}
          iconStyle={{zIndex: 900, color: '#777777'}}
          onTouchTap={this.openMenu}
        >
          <MenuIcon />
        </IconButton>
      )
    } else {
      return (
        <AppBar
          title={this.props.title}
          onLeftIconButtonTouchTap={this.openMenu}
          children={

            <NetworkSelector
              messageActions={this.props.messageActions}
              trees={this.props.trees}
              currentNetwork={this.props.currentNetwork}
              currentNetworkActions={this.props.currentNetworkActions}
              propertyActions={this.props.propertyActions}
            />
          }
        >
        </AppBar>
      )
    }
  }

  render() {

    const {
      uiState, uiStateActions, networks, networkId,
      styles, currentVsActions, backgroundColorActions,
      backgroundColor, currentVs, datasource, trees
    } = this.props


    return (
      <div>

        {this.getBar()}

        <Drawer
          docked={false}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
          style={dStyle}
          width={400}
        >
          <MainMenu
            networks={networks}
            networkId={networkId}
            uiState={uiState}
            uiStateActions={uiStateActions}
            styles={styles}
            currentVsActions={currentVsActions}
            currentVs={currentVs}
            trees={this.props.trees}
            currentNetwork={this.props.currentNetwork}
            currentNetworkActions={this.props.currentNetworkActions}
          />
        </Drawer>
      </div>
    )
  }
}
