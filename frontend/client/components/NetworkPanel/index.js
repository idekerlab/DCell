import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import CyViewer from 'cy-viewer'

import Loading from '../Loading'

import ErrorIcon from 'material-ui/svg-icons/alert/error-outline'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'
import FlatButton from 'material-ui/FlatButton'

import style from './style.css'


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

    window.setTimeout(()=>{
      const root = this.props.trees[this.props.currentNetwork.id].rootNode

      this.props.eventActions.selected(nodeProps[nodeIds[0]])
      this.props.commandActions.findPath({startId:nodeIds[0].replace(/\:/, '\\:'), endId: root.replace(/\:/, '\\:')})

      const options = this.props.trees[this.props.currentNetwork.id].searchOptions
      this.props.propertyActions.fetchEntry(props.id, options)
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

      // Need to fetch network data
      if(nextNet.id !== this.props.currentNetwork.id) {
        this.props.networkActions.fetchNetworkFromUrl(newUrl)
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    console.log("********* State checking=======================================================================================")
    console.log(this.props)
    console.log(nextProps)

    const curNet = this.props.currentNetwork
    const nextNet = nextProps.currentNetwork

    const curNetId = curNet.id
    const nextNetId = nextNet.id

    if(curNetId === nextNetId && nextProps.network.get('loading') === this.props.network.get('loading')) {



      console.log("same main network: " + curNetId + '############################################################################################')
      return false
    }

    const newUrl = nextProps.trees[nextNetId].url
    const network = nextProps.network.get(newUrl)

    if(network === undefined) {
      console.log("2UNDEF NET--------------------")
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
        "color" : "#555555",
        "background-color" : "teal",
        "height" : 'mapData(geneCount, 0, 6000, 10, 400)',
        "width" : 'mapData(geneCount, 0, 6000, 10, 400)',
        "content" : "data(name)",
        "min-zoomed-font-size": '0.3em',
        "font-size" : 'mapData(geneCount, 0, 6000, 8, 400)',
        "text-opacity" : 1,
        'text-wrap': 'wrap',
        'text-max-width': '180px'
      }
    }, {
      "selector" : "node:selected",
      "css" : {
        "background-color" : "red",
        "font-size" : '3em',
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
        "width" : 4.0,
        'opacity': 0.4,
        "line-color" : "#555555",
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
        "color" : "#555555",
        "background-color" : "rgb(204,204,204)",
        "height" : 'mapData(geneCount, 1, 6000, 30, 400)',
        "width" : 'mapData(geneCount, 1, 6000, 30, 400)',
        "content" : "data(name)",
        "min-zoomed-font-size": '1em',
        "font-size" : 'mapData(geneCount, 1, 6000, 6, 100)',
        "text-opacity" : 1,
        'text-wrap': 'wrap',
        // 'text-max-width': '120px',
        'z-index': 1
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
        "color" : "rgb(0,153,204)",
        "label": "Biological Process"
      }
    }, {
      "selector" : "node[name = 'cellular_component']",
      "css" : {
        "color" : "rgb(255,102,0)",
        "label": "Cellular Component"
      }
    }, {
      "selector" : "node[name = 'molecular_function']",
      "css" : {
        "color" : "rgb(0,204,153)",
        "label": "Molecular Function"
      }
    }, {
      "selector" : "node[name = 'GO:00SUPER']",
      "css" : {
        'font-size': '20em',
        'label': 'GO Root'
      }
    }, {
      "selector" :
        "node[name = 'biological_process'], " +
        "node[name = 'molecular_function'], " +
        "node[name = 'cellular_component']",
      "css" : {
        'font-size': '55em',
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
        "width" : 25.0,
        'opacity': 0.5,
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
    console.log('**** MAIN VIEW ============================================================== Custom node select function called! ========');

    const loading = this.props.network.get('loading')
    if(loading) {
      return (
        <Loading />
      )
    }




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