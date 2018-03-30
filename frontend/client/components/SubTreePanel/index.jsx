import React, {Component} from 'react';
import LegendColor from './LegendColor'
import LegendLine from './LegendLine'
import DefaultPanel from './DefaultPanel'
import {DAGViewer} from 'tree-viewer'

import cytoscape from 'cytoscape'

import Speedometer from '../Speedometer'

import style from './style.css'


const cardStyle = {
  zIndex: '1200',
  position: 'fixed',
  margin: 0,
  padding: 0,
  bottom: 0,
}

class SubTreePanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMax: true,
      expand: false,
      filterDag: null
    }
  }


  componentWillReceiveProps(nextProps) {

    // Open view automatically
    const runningLast = this.props.queryGenes.get('running')
    const running = nextProps.queryGenes.get('running')

    if(runningLast && running === false) {
      this.props.uiStateActions.showResult(true)
    }

    const result = nextProps.queryGenes.get('result')
    if(result === null || result === undefined) {
      return
    }
  }


  render() {

    const result = this.props.queryGenes.get('result')
    const running = this.props.queryGenes.get('running')

    // Placeholder
    if(result === null && !running) {
      return(<DefaultPanel/>)
    } else if(result === null && running) {
      return (
        <div />
      )
    }

    const genesMap = this.props.queryGenes.get('genes')
    const genes = Object.values(genesMap.toJS())

    const genotype = genes.reduce(
      (previousValue, currentValue, index, array) => {
        return previousValue + ", " + currentValue
      }
    )


    const titleStyle = {
      color: '#26C6DA',
      fontWeight: 700,
      position: 'fixed',
      bottom: '1em',
      paddingLeft: '1em',
      zIndex: 1210,
      background: 'rgba(0,0,0,0)',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '40%'
    }

    const labelStyle = {
      color: '#777777',
      fontSize: '0.6em',
      fontWeight: 300,
      padding: '0.5em',
      width: '2em'
    }


    const legendTitleStyle = {
      color: '#444444',
      width: '25em',
      fontSize: '0.8em'
    }

    let dag = this.getDag(result)
    const main = this.getMainContents(dag)

    console.log("RES8******************",this.props)

    const growth = dag.data.growth 
    const gi = dag.data.gi 

    return (
      <div className={style.container}>

        <Speedometer
          {...this.props}
          growth={growth}
          gi={gi}
        />

        <div style={cardStyle}>
          {main}
        </div>

        <div style={titleStyle}>

          <div style={legendTitleStyle}>
            Absolute Change in State from wildtype:
          </div>

          <div style={labelStyle}>
            0 (wt)
          </div>

          <LegendColor />

          <div style={labelStyle}>
            1
          </div>

          <LegendLine/>

        </div>

      </div>
    )
  }


  handleToggle = () => {
    this.setState({expand: !this.state.expand})
  }

  toggleWindow = () => {
    this.setState({
      isMax: !this.state.isMax
    })
  }


  handleClose = () => {
    this.props.uiStateActions.showResult(false)
  }

  getMainContents = (dag) => {

    const w = window.innerWidth - 450
    const h = this.state.isMax ? window.innerHeight : window.innerHeight * 0.4

    const treeStyle = {
      width: w,
      height: h,
      background: '#777777'
    }



    // if(this.state.filterDag !== null) {
    //   console.log("###################### FILTER***********************************")
    //   dag = this.filter(dag, this.state.filterDag.source, this.state.filterDag.target)
    // }

    const queryType = this.props.queryGenes.get('queryType')

    return (
      <DAGViewer
        queryType={queryType}
        data={dag}
        label="long_name"
        style={treeStyle}
        expand={this.state.expand}
      />
    )

  }


  nodeSelected = (selectedNode) => {

    const result = this.props.queryGenes.get('result')
    // this.props.queryGenesActions.pivot(result, 'http://localhost:5000/', selectedNode)

    // Filter network
    this.setState({
      filterDag: {
        source: selectedNode,
        target: 'GO:00SUPER'
      }

    })

  }



  filter = (net, start, end) => {

    console.log('Path finfing2 *********************************************************************')
    console.log(net)
    console.log(start)
    console.log(end)

    const cy = cytoscape({
      headless: true,
      elements: net.elements
    })

    // Start node
    const r = start.replace(/\:/, '\\:')

    const newNodes = []

    cy.elements().bfs({
      root: '#' + r,
      directed: true,
      visit: function(i, depth) {
        newNodes.push(this)
      },
    });


    const ndata = cy.collection(newNodes)

    const newEdges = ndata.connectedEdges()

    const cy2 = cytoscape({
      headless: true
    })

    const np = newEdges.connectedNodes()
    cy2.add(np)
    cy2.add(newEdges)

    const newNet = cy2.json()

    return newNet
  }

  getDag = result => {

    const net = {
      data: {
        name: 'simulation result'
      },
      elements: {
        nodes: [],
        edges: []
      }
    }

    if (result === null || result === undefined) {
      return net
    }

    const nodes = result.data.nodes.map(node => {

      let nodeType = 'term'

      if(node.id.endsWith('SUPER')) {
        net.data.growth = node.importance
      }

      if (node.id.startsWith('Y')) {
        nodeType = 'gene'
        return {
          data: {
            id: node.id,
            type: nodeType,
            name: node.name,
            fullName: node.fullName
          }
        }
      } else {

        return {
          data: {
            id: node.id,
            type: nodeType,
            name: node.name,
            namespace: node.namespace,
            score: node.importance,
            phenotype: node.phenotype,
            neurons: node.neurons
          }
        }
      }

    })
    const edges = result.data.edges.map(edge => ({data: edge}))

    net.elements.nodes = nodes
    net.elements.edges = edges

    return net
  }
}

export default SubTreePanel
