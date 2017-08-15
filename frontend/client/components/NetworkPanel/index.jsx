import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import CyViewer from 'cy-viewer'

import Loading from '../Loading'

import ErrorIcon from 'material-ui/svg-icons/alert/error-outline'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'
import FlatButton from 'material-ui/FlatButton'

import style from './style.css'

import {Map} from 'immutable'


import * as d3Scale from 'd3-scale'


const labelSizeMapper = d3Scale.scaleLog()
  .domain([0, 5000])
  .range([20, 300]);

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
      try {
        this.props.commandActions.findPath({startId:nodeIds[0].replace(/\:/, '\\:'), endId: root.replace(/\:/, '\\:')})
      } catch(e) {
        console.log('* Failed FindPath')
        console.log(e)
      }

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

    if(nextProps.commands.target === 'subnet') {
      return false
    }

    const curNet = this.props.currentNetwork
    const nextNet = nextProps.currentNetwork

    const curNetId = curNet.id
    const nextNetId = nextNet.id

    if(curNetId === nextNetId && nextProps.network.get('loading') === this.props.network.get('loading')) {
      // Check commands difference
      if (this.props.commands !== nextProps.commands) {
        return true
      }

      return false
    }

    const newUrl = nextProps.trees[nextNetId].url
    const network = nextProps.network.get(newUrl)

    if(network === undefined) {
      return false
    }



    return true
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("##################################################################################################################RENDERED!!!!!!!!!")

    this.props.messageActions.setMessage('Neural network browser is ready!')

    window.setTimeout(() => {
      this.props.messageActions.setMessage('DeepCell v1.0')
    }, 3000)
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
        // "font-size" : 'mapData(geneCount, 0, 6000, 8, 400)',
        "font-size": "val => (labelSizeMapper(geneCount))",
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
        "width" : 10.0,
        'opacity': 0.6,
        "line-color" : "#555555",
      }
    }, {
      "selector" : "edge:selected",
      "css" : {
        "line-color" : "red",
        "width": 20,
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
        "color" : "#000000",
        "background-color" : "rgb(204,204,254)",
        // "height" : 'mapData(geneCount, 1, 6000, 30, 400)',
        // "width" : 'mapData(geneCount, 1, 6000, 30, 400)',
        "height" : 100,
        "width" : 100,
        "content" : "data(name)",
        "min-zoomed-font-size": '12',
        // "font-size" : 'mapData(geneCount, 1, 6000, 6, 650)',
        // "font-size" : 'mapData(geneCount, 1, 6000, 6, 650)',
        "font-size": "data(labelSize)",
        "text-opacity" : 1,
        'text-wrap': 'wrap',
        'text-max-width': '600px',
        'z-index': 1
      }
    }, {
      "selector" : ".invisible",
      "css" : {
        'display': 'none',
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
        "font-size" : 'mapData(geneCount, 1, 6000, 6, 650)',
        "min-zoomed-font-size": '4.5em',
      }
    }, {
      "selector" : "node[namespace = 'molecular_function']",
      "css" : {
        "background-color" : "rgb(0,204,153)",
        "font-size" : 'mapData(geneCount, 1, 6000, 6, 1150)',
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
        'label': 'Root'
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
        "font-size" : '7em',
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
        "width" : 30.0,
        'opacity': 1,
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
      "selector" : ".faded",
      "css" : {
        "background-color" : "black",
        "line-color" : "black",
        color: "black",
        opacity: 0.2
      }
    },{
      "selector" : ".focused",
      "css" : {
        opacity: 1,
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


  render() {
    console.log('**** MAIN VIEW ============================================================== Custom node select function called! ========');
    console.log(this.props)

    const loading = this.props.network.get('loading')

    if(loading) {
      return (
        <Loading />
      )
    }

    let commands = this.props.commands
    if(commands.target === 'subnet') {
      console.log("%%%%%ignore")
      commands = Map({
        command: '',
        parameters: {}
      })
    }


    const networkAreaStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    };


    const curNetId = this.props.currentNetwork.id
    const url = this.props.trees[curNetId].url
    const networkProp = this.props.network
    const networkData = networkProp.get(url)


    let style = this.getVisualStyle()

    if (curNetId === 'clixo') {
      style = this.getVisualStyle2()
    }

    console.log(style)

    return (
      <CyViewer
        key="mainView"
        network={networkData}
        networkType={'cyjs'}
        style={networkAreaStyle}
        networkStyle={style}
        eventHandlers={this.getCustomEventHandlers()}
        command={commands}
      />
    )
  }
}

export default NetworkPanel