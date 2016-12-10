import React, {Component} from 'react'
import {browserHistory} from 'react-router'


import * as colors from 'material-ui/styles/colors';

import CyViewer from 'cy-viewer'

import Loading from '../Loading'

import ErrorIcon from 'material-ui/svg-icons/alert/error-outline'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'
import FlatButton from 'material-ui/FlatButton'

import style from './style.css'

const cyjsUrl = 'https://gist.githubusercontent.com/keiono/b7c047c1166681ef7170881217819938/raw/b81de1da63075ceb0e4c8d99adeacf83d0193cdb/goWOgenes.cyjs'
// const cyjsUrl = 'https://raw.githubusercontent.com/idekerlab/ontology-data-generators/master/atgo.cyjs'
// const cyjsUrl = 'https://gist.githubusercontent.com/keiono/004744a332451a472bf85c8beefba9db/raw/0955dddc4a3ea5a0e87423a349e5b2b16ec46fa2/gotree2.cyjs'


class NetworkPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      updating: false
    };
  }


  selectNodes = (nodeIds, nodeProps) => {
    const node = nodeIds[0]
    const props = nodeProps[node]

    console.log('====== Custom node select function called! ========');
    console.log('Selected Node ID: ' + node)
    console.log(props)

    window.setTimeout(()=>{
      this.props.eventActions.selected(nodeProps[nodeIds[0]])
      this.props.commandActions.findPath({startId:nodeIds[0], endId: '4022'})
      this.props.propertyActions.fetchEntry(props.id_original)
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

  handleBack = () => {
    browserHistory.push('/')
  }

  // Initialize
  componentWillMount() {
    this.props.networkActions.fetchNetworkFromUrl(cyjsUrl)
  }

  getError() {
    return (
      <div className={style.container}>
        <h1>A Problem Occurred While Downloading Data</h1>
        <h2>Possible Causes:</h2>
        <h3>Invalid URL</h3>
        <h3>Invalid NDEx ID</h3>
        <h3>Remote server is down</h3>
        <ErrorIcon
          color={'#ff0033'}
          style={{width: '40%', height: '40%'}}
        />

        <FlatButton
          label="Back to Data Source Selector"
          labelPosition='after'
          labelStyle={{fontWeight: 700}}
          icon={<BackIcon/>}
          onClick={this.handleBack}
        />
      </div>
    )
  }


  getVisualStyle = () => ({
    style: [ {
      "selector" : "node",
      "css" : {
        "width" : 10.0,
        "text-valign" : "center",
        "text-halign" : "right",
        "shape" : "ellipse",
        "color" : "rgba(50,50,50,0.1)",
        "background-color" : "rgb(204,204,204)",
        "height" : 10.0,
        "content" : "data(name)",
        "min-zoomed-font-size": '3em',
        "font-size" : '0.4em',
      }
    }, {
      "selector" : "node[namespace = 'biological_process']",
      "css" : {
        "background-color" : "rgb(0,153,204)"
      }
    }, {
      "selector" : "node[namespace = 'cellular_component']",
      "css" : {
        "background-color" : "rgb(255,102,0)"
      }
    }, {
      "selector" : "node[namespace = 'molecular_function']",
      "css" : {
        "background-color" : "rgb(0,204,153)"
      }
    }, {
      "selector" : "node:selected",
      "css" : {
        "background-color" : "orange",
        "width" : 35.0,
        "height" : 35.0,
        "font-size" : '2em',
        "color" : "orange"
      }
    }, {
      "selector" : "edge",
      "css" : {
        "width" : 5.0,
        "line-color" : "rgb(132,132,132)",
      }
    }, {
      "selector" : "edge[branch = 'CC']",
      "css" : {
        "line-color" : "rgb(255,102,0)"
      }
    }, {
      "selector" : "edge[branch = 'MF']",
      "css" : {
        "line-color" : "rgb(0,204,102)"
      }
    }, {
      "selector" : "edge[branch = 'BP']",
      "css" : {
        "line-color" : "rgb(0,153,204)"
      }
    }, {
      "selector" : "edge:selected",
      "css" : {
        "line-color" : "orange",
        "width": 15
      }
    } ]
  })


  render() {
    const {
      commands
    } = this.props


    const networkAreaStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    };

    let errorMsg = null
    let failed = false

    if (errorMsg === null || errorMsg === undefined) {
      failed = false
    } else {
      failed = true
    }

    // const network = this.props.networks.get(cyjsUrl)

    const networkProp = this.props.network
    console.log(this.props)
    console.log(networkProp)

    if (failed) {
      return this.getError()
    } else if (networkProp.network.elements !== undefined) {

      return (
        <CyViewer
          key="mainView"
          network={networkProp.network}
          networkType={'cyjs'}
          style={networkAreaStyle}
          networkStyle={this.getVisualStyle()}
          eventHandlers={this.getCustomEventHandlers()}
          command={commands}
        />
      )
    } else {
      // Display loading animation if data is not available
      return (
        <Loading />
      )
    }
  }
}

export default NetworkPanel