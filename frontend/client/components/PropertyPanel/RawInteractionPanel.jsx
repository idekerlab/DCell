import React, {Component} from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CyViewer from 'cy-viewer'

import FlatButton from 'material-ui/FlatButton';



import FilterPanel from './FilterPanel'


class RawInteractionPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
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

      if(nextProps.commands !== undefined) {
        return true
      }

      return false;
    }
    return true
  }


  render() {

    console.log("%%%%%%%%%%%%%%%% Rendering RAW=====================================")
    console.log(this.props)

    const style = {
      width: '100%',
      height: '50em',
      background: '#000000'
    }

    const iconStyle = {
      color: 'white',
    }

    return (
      <div style={style}>

        {this.getMainContents()}

      </div>
    )
  }

  getMainContents = () => {

    if(this.props.subnet === null || this.props.subnet === undefined) {
      return (<div></div>)
    }


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
            command={this.props.commands}
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
        "color" : "white",
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
        "width" : "mapData(score, 0.0, 1.0, 0.1, 7.0)",
        "opacity" : "mapData(score, 0.0, 1.0, 0.01, 0.7)",

        // "line-color": 'white'
        "line-color" : ele => {
          const type = ele.data("interaction")
          const c = this.props.colorFunction(type)
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
      "selector" : ".dark",
      "css" : {
        "visibility": 'hidden'
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

