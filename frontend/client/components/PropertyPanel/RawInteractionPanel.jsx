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




  shouldComponentUpdate(nextProps, nextState) {

    if(nextProps.selectedTerm === undefined || this.props.selectedTerm === undefined) {
      return false
    }

    if(nextProps.selectedTerm === this.props.selectedTerm) {

      if(nextProps.loading !== this.props.loading) {
        return true
      }
      return false;
    }
    return true
  }


  render() {

    console.log('rendering RAW #######################################################################################################');
    console.log(this.props)


    const style = {
      width: '100%',
      height: '60em',
      background: '#EFEFEF'
    }

    const iconStyle = {
      color: 'white',
    }

    return (
      <div style={style}>

        {this.getMainContents()}

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

  getMainContents = () => {

    const networkAreaStyle = {
      width: '100%',
      height: '100%',
      top: 0,
      right: 0,
      position: 'relative'
    }

    if(!this.props.loading) {

      return (
        <CyViewer
          key="subNetworkView"
          network={this.props.subnet.toJS()}
          networkType={'cyjs'}
          networkStyle={this.getStyle()}
          style={networkAreaStyle}
          eventHandlers={this.getCustomEventHandlers()}
          rendererOptions={{layout: 'concentric'}}
        />
      )
    } else {
      return (<h2>Loading networks...</h2>)
    }

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
        "background-color" : "red",
        "font-size" : "4em",
        "color" : "orange",
        content: "data(fullName)",
        "text-max-width": '200px'
      }
    }, {
      "selector" : "edge",
      "css" : {
        "width" : "mapData(score, 0.0, 1.0, 0.1, 10)",
        "opacity" : "mapData(score, 0.0, 1.0, 0.05, 1.0)",

        "line-color" : ele => {
          const type = ele.data("interaction")
          const c = this.state.colorFunction(type)
          return c
        },
      }
    }, {
      "selector" : "edge:selected",
      "css" : {
        "line-color" : "rgb(255,0,0)",
        "width": 14
      }
    }, {
      "selector" : ".faded",
      "css" : {
        "background-color" : "black",
        "line-color" : "black",
        color: "black",
        opacity: 0.2
      }
    }, {
      "selector" : ".focused",
      "css" : {
        "background-color" : "teal",
        "font-size" : '4em',
        "color" : "teal",
        "text-opacity": 1,
        'text-max-width': '500px',
        'z-index': 999,
        "min-zoomed-font-size": 0,
        width: 50,
        height: 50
      }
    } ]
  })


  selectNodes = (nodeIds, nodeProps) => {
    const node = nodeIds[0]
    const props = nodeProps[node]

    console.log('RAW ============================================================== Custom node select function called! ========');
    console.log('Selected Node ID: ' + node)
    console.log(props)

    window.setTimeout(()=>{
      // const root = this.props.trees[this.props.currentNetwork.id].rootNode

      // this.props.commandActions.focus({idList: [props.id]})
      // this.props.commandActions.findPath({startId:nodeIds[0].replace(/\:/, '\\:'), endId: root.replace(/\:/, '\\:')})

      // const options = this.props.trees[this.props.currentNetwork.id].searchOptions
      // this.props.propertyActions.fetchEntry(props.id, options)
    }, 0)
  }

  selectEdges = (edgeIds, edgeProps) => {
    console.log('====== Custom edge select function called! ========');
    console.log('Selected Edge ID: ' + edgeIds)
    console.log(edgeProps)
  }

// Then use it as a custom handler
  getCustomEventHandlers = () => ({
    selectNodes: this.selectNodes,
    selectEdges: this.selectEdges
  })
}

export default RawInteractionPanel

