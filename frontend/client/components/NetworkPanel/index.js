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
const edgeColor = '#777777'




class NetworkPanel extends Component {
  selectNodes = (nodeIds, nodeProps) => {
    console.log('====== Custom node select function called! ========');
    console.log('Selected Node ID: ' + nodeIds)
    console.log(nodeProps)
    console.log(nodeProps[nodeIds[0]])
    this.props.commandActions.findPath({startId:nodeIds[0], endId: '4022'})
    this.props.eventActions.selected(nodeProps[nodeIds[0]])
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

  componentWillMount() {
    this.props.downloadActions.downloadBegin()
    this.props.downloadActions.fetchNetwork(cyjsUrl)
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

  sizeCalculator = ele => {
    const size = ele.data('Size')
    if (size !== undefined) {
      return Math.log(size) * 30
    } else {
      return 10
    }
  }

  fontSizeCalculator = ele => {
    const size = ele.data('Size')
    if (size !== undefined) {
      const fontSize = Math.log(size) / 2
      return fontSize + 'em'
    } else {
      return '1em'
    }
  }

  getVisualStyle = () => ({
    style: [ {
      "selector" : "node",
      "css" : {
        opacity: 0.4,
        "width" : 10.0,
        "text-valign" : "center",
        "text-halign" : "right",
        "shape" : "ellipse",
        "color" : "#666666",
        "background-color" : "rgb(204,204,204)",
        "height" : 10.0,
        "content" : "data(name)",
        "min-zoomed-font-size": '2em',
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
    // }, {
    //   "selector" : "node[Degree > 1][Degree <= 296]",
    //   "css" : {
    //     "font-size" : "mapData(Degree,1,296,4,100)"
    //   }
    }, {
      "selector" : "node:selected",
      "css" : {
        opacity: 1,
        "background-color" : "red",
        "width" : 50.0,
        "height" : 50.0,
        "font-size" : 30,
        "color" : "red"
      }
    }, {
      "selector" : "edge",
      "css" : {
        "width" : 5.0,
        opacity: 0.4,
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
        "line-color" : "rgb(255,0,0)",
        opacity: 1,
        "width": 20
      }
    } ]
  })

  getVisualStyle2 = () => ({
    style: [
      {
        "selector": "node",
        "css": {
          "font-family": "SansSerif",
          "shape": "ellipse",
          "background-color": 'mapData(score, 0, 1,' + colors.blue50 + ',' + colors.blue800 + ')',
          "width": this.sizeCalculator,
          "text-margin-x": '1em',
          "text-valign": "center",
          "text-halign": "right",
          "color": colors.blueGrey700,
          "min-zoomed-font-size": '1em',
          "font-size": this.fontSizeCalculator,
          "height": this.sizeCalculator,
          "content": "data(Manual_Name)",
          "text-wrap": 'wrap',
          "text-max-width": '40em'
        }
      },
      {
        "selector": "node:selected",
        "css": {
          "background-color": "red",
          "color": "red"
        }
      },
      {
        "selector": "edge",
        "css": {
          "opacity": 0.5,
          "line-color": edgeColor,
          "source-arrow-shape": 'triangle',
          "mid-source-arrow-shape": 'triangle',
          "source-arrow-color": edgeColor,
          "mid-source-arrow-color": edgeColor,
          "color": "white"
        }
      },
      {
        "selector": "edge:selected",
        "css": {
          "line-color": "red",
          "color": "white",
          "source-arrow-color": "red",
          "mid-source-arrow-color": "red",
          "width": '1em'
        }
      },
    ]
  })

  render() {
    const {
      commands, commandActions, events, networkDownload,
      eventActions, networkId, styles, currentVs,
      backgroundColor, vsActions, currentVsActions
    } = this.props


    const networkAreaStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    };

    let errorMsg = networkDownload.get('error')
    let failed = false

    if (errorMsg === null || errorMsg === undefined) {
      failed = false
    } else {
      failed = true
    }

    const network = this.props.networks.get(cyjsUrl)


    if (failed) {
      return this.getError()
    } else if (network !== undefined) {
      return (
        <CyViewer
          network={network.toJS()}
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