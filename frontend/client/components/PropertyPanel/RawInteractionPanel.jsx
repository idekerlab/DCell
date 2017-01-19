import React, {Component} from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import CyViewer from 'cy-viewer'

import * as d3Scale from 'd3-scale'
import * as d3ScaleChromatic from 'd3-scale-chromatic'


class RawInteractionPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      colorFunction: d3Scale.scaleOrdinal(d3ScaleChromatic.schemeAccent)
    };
  }

  getStyle = () => {

    const colorMap = d3Scale.scale.category10()
    return {

    }
  }

  componentWillReceiveProps(nextProps) {


  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.selectedTerm === this.props.selectedTerm) {
      if(nextProps.subnet.elements.nodes.length === 0 ||
        nextProps.subnet.elements.nodes.length === this.props.subnet.elements.nodes.length ) {
        console.log("===============******************************************************************************SAME ******** ==================")
        return false
      }
    }


    return true
  }

  render() {

    console.log("===============******************************************COLOR2 ********* ==================")

    console.log(this.state.colorFunction)

    const style = {
      width: '100%',
      height: '60em',
      background: '#EFEFEF'
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
          rendererOptions={{layout: 'concentric'}}
        />

        <FloatingActionButton
          backgroundColor={"teal"}
          style={{position: 'fixed', top: '0.7em', marginLeft: '0.7em', zIndex: 999}}
          onClick={this.props.handleClose}
          iconStyle={iconStyle}
          mini={true}
        >
          <CloseIcon/>
        </FloatingActionButton>
      </div>
    )
  }

  loading = () => {
    return (
      <div style={style}>

        <h2>Loading networks...</h2>
        <FloatingActionButton
          backgroundColor={"teal"}
          style={{position: 'fixed', top: '0.7em', marginLeft: '0.7em', zIndex: 999}}
          onClick={this.props.handleClose}
          iconStyle={iconStyle}
          mini={true}
        >
          <CloseIcon/>
        </FloatingActionButton>
      </div>

    )
  }


  getStyle = () => ({
    style: [ {
      "selector" : "node",
      "css" : {
        "width" : 15.0,
        "text-valign" : "center",
        "text-halign" : "right",
        "shape" : "ellipse",
        "color" : "#555555",
        "background-color" : "#CCCCCC",
        "height" : 15.0,
        "font-size" : '3em',
        "content" : "data(name)",
        "min-zoomed-font-size": '0.2em',
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
        "width" : "mapData(score, 0.5, 5, 0.1, 10)",
        "opacity" : "mapData(score, 0.5, 5, 0.05, 1.0)",

        "line-color" : ele => {
          const type = ele.data("interaction")
          const c = this.state.colorFunction(type)
          console.log(type)
          console.log(c)
          return c
        },
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

export default RawInteractionPanel

