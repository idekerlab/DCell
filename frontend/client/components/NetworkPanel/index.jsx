import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import CyViewer from 'cy-viewer'
import Loading from '../Loading'
import ErrorIcon from 'material-ui/svg-icons/alert/error-outline'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back'
import FlatButton from 'material-ui/FlatButton'

import style from './style.css'
import {Map} from 'immutable'


const loaderStyle = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  flexFlow: 'row wrap',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2800
}


class NetworkPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      statusMessage: 'Initializing application.  Please be patient...'
    };
  }

  selectNodes = (nodeIds, nodeProps) => {
    const node = nodeIds[0]
    const props = nodeProps[node]

    console.log('====== Custom node select function called! ========');

    window.setTimeout(() => {
      const root = this.props.trees[this.props.currentNetwork.id].rootNode

      this.props.eventActions.selected(nodeProps[nodeIds[0]])
      try {
        this.props.commandActions.findPath({startId: nodeIds[0].replace(/\:/, '\\:'), endId: root.replace(/\:/, '\\:')})
      } catch (e) {
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

    if (network === undefined || network === null) {

      // Need to fetch network data
      if (nextNet.id !== this.props.currentNetwork.id) {
        this.props.networkActions.fetchNetworkFromUrl(newUrl)
      }
    }

    const nextSelected = this.getSelectedNodes(nextProps)
    const selected = this.getSelectedNodes(this.props)


    if(nextSelected === undefined
      || nextSelected === []
      || nextSelected.length === selected.length) {
      return
    } else {
      const running1 = this.props.queryGenes.get('running')
      const running2 = nextProps.queryGenes.get('running')

      if(running1 === true && running2 === false) {
        this.props.commandActions.select({
          idList: nextSelected,
          edges: nextProps.queryGenes.get('result').data.edges
        })
      }
    }
  }

  getSelectedNodes = (data) => {
    const genes = data.queryGenes.get('result')

    if(genes === null) {
      return []
    }

    const nodes = genes.data.nodes
    const selectedNodeIds = nodes.map(node => (node.id)).filter(id=>{
      if(id.startsWith('GO')) {
        return true
      } else {
        return false
      }
    })

    console.log(selectedNodeIds)
    return selectedNodeIds
  }

  shouldComponentUpdate(nextProps, nextState) {

    if (nextProps.commands.target === 'subnet') {
      return false
    }

    const curNet = this.props.currentNetwork
    const nextNet = nextProps.currentNetwork
    const curNetId = curNet.id
    const nextNetId = nextNet.id

    if (curNetId === nextNetId && nextProps.network.get('loading') === this.props.network.get('loading')) {
      // Check commands difference
      if (this.props.commands !== nextProps.commands) {
        return true
      }

      return false
    }

    const newUrl = nextProps.trees[nextNetId].url
    const network = nextProps.network.get(newUrl)

    if (network === undefined) {
      return false
    }


    return true
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("###############################################RENDERED!!!!!!!!!")

    this.props.messageActions.setMessage('')
    console.log("Message updated.")

    // window.setTimeout(() => {
    //   this.props.messageActions.setMessage('')
    //   console.log("Message updated.")
    // }, 3000)
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
    style: [{
      "selector": "node",
      "css": {
        "text-valign": "center",
        "text-halign": "right",
        "shape": "ellipse",
        "color": "#555555",
        "background-color": "teal",
        "height": 'mapData(geneCount, 0, 6000, 10, 400)',
        "width": 'mapData(geneCount, 0, 6000, 10, 400)',
        "content": "data(name)",
        "min-zoomed-font-size": '0.3em',
        "font-size": "val => (labelSizeMapper(geneCount))",
        "text-opacity": 1,
        'text-wrap': 'wrap',
        'text-max-width': '180px'
      }
    }, {
      "selector": "node:selected",
      "css": {
        "background-color": "#FF6666",
        "font-size": '3em',
        "color": "red",
        "text-opacity": 0.7,
        'text-max-width': '400px',
        'z-index': 109,
        "min-zoomed-font-size": 0,
        width: 25,
        height: 25
      }
    }, {
      "selector": "edge",
      "css": {
        "width": 20.0,
        'opacity': 1,
        "line-color": "#111111",
      }
    }, {
      "selector": "edge:selected",
      "css": {
        "line-color": "red",
        "width": 20,
        'opacity': 1
      }
    }]
  })


  getVisualStyle = () => ({
    style: [{
      "selector": "node",
      "css": {
        "text-valign": "center",
        "text-halign": "right",
        "shape": "ellipse",
        "color": "#66666a",
        "background-color": "rgb(200,200,206)",
        "height": 'mapData(geneCount, 1, 6000, 140, 2000)',
        "width": 'mapData(geneCount, 1, 6000, 140, 2000)',
        "content": "data(name)",
        "min-zoomed-font-size": '0.4em',
        "font-size": 'mapData(geneCount, 1, 6000, 70, 1200)',
        "text-opacity": 1,
        'text-wrap': 'wrap',
        'text-max-width': '30000',
        'text-margin-x': '20',
        'z-index': 1
      }
    }, {
      "selector": ".invisible",
      "css": {
        'display': 'none',
      }
    }, {
      "selector": "node[type = 'g']",
      "css": {
        'font-size': '80',
      }
    }, {
      "selector": "node[pLen <= 4][geneCount > 1500]",
      "css": {
        'font-size': ele => (3200 / (ele.data('pLen'))),
      }
    }, {
      "selector": "node[type = 'r']",
      "css": {
        'font-size': '300em',
        'width': 10000,
        'height': 10000,
        "text-valign": "center",
        "text-halign": "center",
        'label': 'Cell',
        'border-width': 400,
        'border-color': '#555555',
        'background-color': '#FFFFFF'
      }
    }, {
      "selector":
      "node[id = 'GO:0008150'], " +
      "node[id = 'GO:0003674'], " +
      "node[id = 'GO:0005575']",
      "css": {
        'font-size': '200em',
        "text-valign": "top",
        'text-opacity': '0.6'
      }
    }, {
      "selector": "node:selected",
      "css": {
        "background-color": "red",
        "font-size": '50em',
        "color": "red",
        "text-opacity": 0.9,
        'z-index': 999,
        "min-zoomed-font-size": 0,
        'width': 325,
        'height': 325
      }
    }, {
      "selector": "edge",
      "css": {
        "width": 50.0,
        'opacity': 1,
        "line-color": "#000000",
      }
    }, {
      "selector": "edge:selected",
      "css": {
        "line-color": "red",
        "width": 200,
        'opacity': 1
      }
    }, {
      "selector": ".faded",
      "css": {
        "background-color": "black",
        "line-color": "black",
        color: "black",
        opacity: 0.2
      }
    }, {
      "selector": ".focused",
      "css": {
        opacity: 1,
        "background-color": "teal",
        "font-size": '5em',
        "color": "teal",
        "text-opacity": 1,
        'z-index': 999,
        "min-zoomed-font-size": 0,
        width: 80,
        height: 80
      }
    }]
  })


  render() {
    console.log('**** MAIN VIEW ============================================================== Custom node select function called! ========');
    console.log(this.props)

    const loading = this.props.network.get('loading')

    if (loading) {
      return (
        <Loading/>
      )
    }

    let commands = this.props.commands
    if (commands.target === 'subnet') {
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


    const result = this.props.queryGenes.get('result')
    const running = this.props.queryGenes.get('running')

    let loading2 = ( <div></div> )

    if ((result === null || result === undefined) && running) {
      loading2 = (
        <Loading
          style={loaderStyle}
        />
      )
    }



    return (
      <div>



        <CyViewer
          key="mainView"
          network={networkData}
          networkType={'cyjs'}
          style={networkAreaStyle}
          networkStyle={style}
          eventHandlers={this.getCustomEventHandlers()}
          command={commands}
        />
      </div>
    )
  }
}

export default NetworkPanel