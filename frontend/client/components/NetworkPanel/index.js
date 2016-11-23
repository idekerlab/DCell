import React, {Component} from 'react'
import {browserHistory} from 'react-router'


import * as colors from 'material-ui/styles/colors';

import CyViewer from 'cy-viewer'

import Loading from '../Loading'

import ErrorIcon from 'material-ui/svg-icons/alert/error-outline'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'
import FlatButton from 'material-ui/FlatButton'

import style from './style.css'

const cyjsUrl = 'https://raw.githubusercontent.com/idekerlab/ontology-data-generators/master/atgo.cyjs'

const edgeColor = '#777777'







class NetworkPanel extends Component {
  selectNodes = (nodeIds, nodeProps) => {
    console.log('====== Custom node select function called! ========');
    console.log('Selected Node ID: ' + nodeIds)
    console.log(nodeProps)
    console.log(nodeProps[nodeIds[0]])
    this.props.commandActions.findPath({startId:nodeIds[0], endId: '4464'})
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