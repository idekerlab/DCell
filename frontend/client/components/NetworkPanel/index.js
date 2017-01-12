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

// const cyjsUrl = 'https://gist.githubusercontent.com/keiono/2b2e289371b7aff1f47d5e2c2a41fc2a/raw/37bb6d2bd1d81072f95721fd83d88ac3774e365c/clixo-final.cyjs'


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
      this.props.commandActions.findPath({startId:nodeIds[0].replace(/\:/, '\\:'), endId: 'GO\\:00SUPER'})
      this.props.propertyActions.fetchEntry(props.id)
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
    const url = this.props.trees[this.props.currentNetwork.id].url
    this.props.networkActions.fetchNetworkFromUrl(url)
  }

  componentWillReceiveProps(nextProps) {
    const nextNet = nextProps.currentNetwork
    const newUrl = nextProps.trees[nextNet.id].url
    const network = this.props.network.get(newUrl)

    if(network === undefined || network === null) {
      if(this.props.loading !== newUrl) {
        this.props.networkActions.fetchNetworkFromUrl(newUrl)
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextNet = nextProps.currentNetwork
    const newUrl = nextProps.trees[nextNet.id].url
    const network = this.props.network.get(newUrl)


    if(network === undefined) {
      return false
    }

    return true
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

  getVisualStyle2 = () => ({
    style: [ {
      "selector" : "node",
      "css" : {
        "text-valign" : "center",
        "text-halign" : "right",
        "shape" : "ellipse",
        "color" : "#666666",
        "background-color" : "blue",
        "height" : 'mapData(betweenness, 0, 0.00113408, 10, 200)',
        "width" : 'mapData(betweenness, 0, 0.00113408, 10, 200)',
        "content" : "data(name)",
        "min-zoomed-font-size": '0.45em',
        "font-size" : 'mapData(betweenness, 0, 0.00113408, 7, 400)',
        "text-opacity" : 0,
        'text-wrap': 'wrap',
        'text-max-width': '150px'
      }
    }, {
      "selector" : "node[betweenness > 0.0001]",
      "css" : {
        'text-opacity': 1
      }
    }, {
      "selector" : "node:selected",
      "css" : {
        "background-color" : "yellow",
        "width" : 20.0,
        "height" : 20.0,
        "font-size" : '2em',
        "color" : "red",
        "text-opacity": 1,
        'text-max-width': '200px'
      }
    }, {
      "selector" : "edge",
      "css" : {
        "width" : 3.0,
        'opacity': 0.3,
        "line-color" : "rgb(132,132,132)",
      }
    }, {
      "selector" : "edge:selected",
      "css" : {
        "line-color" : "red",
        "width": 10,
        'opacity': 1
      }
    } ]
  })

  getVisualStyle = () => ({
    style: [ {
      "selector" : "node",
      "css" : {
        "text-valign" : "center",
        "text-halign" : "right",
        "shape" : "ellipse",
        "color" : "#666666",
        "background-color" : "rgb(204,204,204)",
        "height" : 'mapData(geneCount, 1, 6000, 7, 160)',
        "width" : 'mapData(geneCount, 1, 6000, 7, 160)',
        "content" : "data(name)",
        "min-zoomed-font-size": '0.5em',
        "font-size" : 'mapData(geneCount, 1, 6000, 1, 70)',
        "text-opacity" : 0,
        'text-wrap': 'wrap',
        'text-max-width': '120px',
        'z-index': 1
      }
    }, {
      "selector" : "node[geneCount > 30]",
      "css" : {
        'text-opacity': 0.4
      }
    }, {
      "selector" : "node[namespace = 'biological_process']",
      "css" : {
        "background-color" : "rgb(0,153,204)",
      }
    }, {
      "selector" : "node[namespace = 'cellular_component']",
      "css" : {
        "background-color" : "rgb(255,102,0)",
      }
    }, {
      "selector" : "node[namespace = 'molecular_function']",
      "css" : {
        "background-color" : "rgb(0,204,153)",
      }
    }, {
      "selector" : "node[name = 'biological_process']",
      "css" : {
        "color" : "rgb(0,153,204)"
      }
    }, {
      "selector" : "node[name = 'cellular_component']",
      "css" : {
        "color" : "rgb(255,102,0)"
      }
    }, {
      "selector" : "node[name = 'molecular_function']",
      "css" : {
        "color" : "rgb(0,204,153)"
      }
    }, {
      "selector" : "node[name = 'GO:00SUPER']",
      "css" : {
        'font-size': 30,
        'label': 'ROOT'
      }
    }, {
      "selector" :
        "node[name = 'biological_process'], " +
        "node[name = 'molecular_function'], " +
        "node[name = 'cellular_component']",
      "css" : {
        'font-size': '15em',
      }
    }, {
      "selector" : "node:selected",
      "css" : {
        "background-color" : "red",
        "font-size" : '2em',
        "color" : "red",
        "text-opacity": 0.7,
        'text-max-width': '400px',
        'z-index': 109,
        "min-zoomed-font-size": 0,
        width: 25,
        height: 25
      }
    }, {
      "selector" : "edge",
      "css" : {
        "width" : 1.0,
        'opacity': 0.2,
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
        "line-color" : "red",
        "width": 10,
        'opacity': 1
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
    }, {
      "selector" : ".faded",
      "css" : {
        "background-color" : "black",
        "line-color" : "black",
        color: "black",
        opacity: 0.2
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


    const networkId = this.props.currentNetwork.id
    const url = this.props.trees[networkId].url
    const networkProp = this.props.network
    const network = networkProp.get(url)


    if (failed) {
      return this.getError()
    } else if (network !== undefined && network.elements !== undefined) {

      const curNet = this.props.currentNetwork.id
      let style = this.getVisualStyle()

      if(curNet === 'clixo') {
        style = this.getVisualStyle2()
      }

      return (
        <CyViewer
          key="mainView"
          network={network}
          networkType={'cyjs'}
          style={networkAreaStyle}
          networkStyle={style}
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