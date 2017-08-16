import React, {Component} from 'react'
import classnames from 'classnames'

import style from './style.css'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import FitContent from 'material-ui/svg-icons/maps/zoom-out-map'
import ZoomIn from 'material-ui/svg-icons/action/zoom-in'
import ZoomOut from 'material-ui/svg-icons/action/zoom-out'
import Settings from 'material-ui/svg-icons/action/settings'

import MainMenu from '../MainMenu'
import Drawer from 'material-ui/Drawer'


const dStyle = {
  padding: 10,
}


export default class Commands extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  openMenu = () => {
    this.setState({open: !this.state.open})
  }

  handleZoomIn = event => {
    this.props.commandActions.zoomIn()
  }

  handleZoomOut = event => {
    this.props.commandActions.zoomOut()
  }

  handleFit = event => {
    this.props.commandActions.fit()
  }

  render() {

    if (!this.props.uiState.get('showCommands')) {
      return (
        <div>
          <div className={classnames(style.bar, style.grid)}>
            <FloatingActionButton
              mini={true}
              className={style.command}
              secondary={true}
              onTouchTap={this.openMenu}
            >
              <Settings/>
            </FloatingActionButton>
          </div>

          {this.getMenuPanel()}
        </div>
      )
    }

    return (
      <div>
        <div className={classnames(style.bar, style.grid)}>
          <FloatingActionButton
            mini={true}
            className={style.command}
            secondary={true}
            onTouchTap={this.openMenu}
          >
            <Settings/>
          </FloatingActionButton>

          <FloatingActionButton
            mini={true}
            className={style.command}
            onTouchTap={this.handleZoomIn}
          >
            <ZoomIn/>
          </FloatingActionButton>
          <FloatingActionButton
            mini={true}
            className={style.command}
            onTouchTap={this.handleZoomOut}
          >
            <ZoomOut/>
          </FloatingActionButton>
          <FloatingActionButton
            mini={true}
            className={style.command}
            onTouchTap={this.handleFit}
          >
            <FitContent/>
          </FloatingActionButton>

        </div>

        {this.getMenuPanel()}

      </div>
    )
  }


  getMenuPanel = () => (
    <Drawer
      docked={false}
      open={this.state.open}
      onRequestChange={(open) => this.setState({open})}
      style={dStyle}
      width={450}
      zDepth={2000}
    >
      <MainMenu
        uiState={this.props.uiState}
        uiStateActions={this.props.uiStateActions}
      />
    </Drawer>
  )
}
