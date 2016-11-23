import React, {Component} from 'react'
import classnames from 'classnames'

import style from './style.css'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import FitContent from 'material-ui/svg-icons/maps/zoom-out-map'
import ZoomIn from 'material-ui/svg-icons/action/zoom-in'
import ZoomOut from 'material-ui/svg-icons/action/zoom-out'


export default class Commands extends Component {

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

    const uiState = this.props.uiState

    if(!uiState.get('showCommands')) {
      return (<div></div>)
    }

    return (
      <div className={classnames(style.bar, style.grid)}>
        <FloatingActionButton
          className={style.command}
          onTouchTap={this.handleZoomIn}
        >
          <ZoomIn />
        </FloatingActionButton>
        <FloatingActionButton
          className={style.command}
          onTouchTap={this.handleZoomOut}
        >
          <ZoomOut />
        </FloatingActionButton>
        <FloatingActionButton
          className={style.command}
          onTouchTap={this.handleFit}
        >
          <FitContent />
        </FloatingActionButton>
      </div>
    )
  }
}
