import React, {Component} from 'react'
import * as colors from 'material-ui/styles/colors';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import CyViewer from 'cy-viewer'


class SubNetworkView extends Component {

  getStyle = () => {
    return {

    }
  }


  render() {

    const style = {
      width: '100%',
      height: '50em',
      background: '#000000'
    }

    const networkAreaStyle = {
      width: '100%',
      height: '100%',
      top: 0,
      right: 0,
      position: 'relative'
    }

    const iconStyle = {
      color: 'white',
    }

    const titleStyle = {
      position: 'fixed',
      top: '0.5em',
      right: '0.7em',
      zIndex: 999
    }

    const subnet = this.props.subnet

    console.log("------------------------>> Subtree rendering")
    console.log(subnet)

    return (
      <div style={style}>

        <CyViewer
          key="subNetworkView"
          network={subnet}
          networkType={'cyjs'}
          networkStyle={this.getStyle()}
          style={networkAreaStyle}
          rendererOptions={{layout: 'breadthfirst'}}
        />

        <FloatingActionButton
          style={{position: 'fixed', top: '0.7em', marginLeft: '0.7em', zIndex: 999}}
          onClick={this.props.handleClose}
          iconStyle={iconStyle}
          mini={true}
        >
          <CloseIcon/>
        </FloatingActionButton>

        <div style={titleStyle}>
          <h2>Sub Tree for selected term</h2>
        </div>
      </div>
    )
  }


  getStyle = () => ({
    style: [ {
      "selector" : "node",
      "css" : {
        "width" : 50.0,
        "text-valign" : "center",
        "text-halign" : "right",
        "shape" : "ellipse",
        "color" : "#666666",
        "background-color" : "rgb(204,204,204)",
        "height" : 30.0,
        "font-size" : 20,
        "content" : "data(name)",
        "min-zoomed-font-size": '1em',
      }
    }, {
      "selector" : "node:selected",
      "css" : {
        "background-color" : "orange",
        "font-size" : 30,
        "color" : "orange"
      }
    }, {
      "selector" : "edge",
      "css" : {
        "width" : 10,
        "mid-target-arrow-shape": "triangle",
        "line-color" : "rgb(132,132,132)",
      }
    }, {
      "selector" : "edge:selected",
      "css" : {
        "line-color" : "rgb(255,0,0)",
        "width": 14
      }
    } ]
  })
}

export default SubNetworkView
