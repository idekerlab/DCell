import React, {Component} from 'react';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';


import LegendColor from './LegendColor'
import RootLegendColor from './RootLegendColor'


import style from './style.css'

import {DAGViewer} from 'tree-viewer'
import Loading from '../Loading'
const loaderStyle = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  flexFlow: 'row wrap',
  alignItems: 'center',
  justifyContent: 'center',
}

import ExpandIcon from 'material-ui/svg-icons/navigation/fullscreen'
import CollapseIcon from 'material-ui/svg-icons/navigation/fullscreen-exit'
import CloseIcon from 'material-ui/svg-icons/content/clear'

// For filtering
import cytoscape from 'cytoscape'




class SubTreePanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMax: true,
      expand: false,
      filterDag: null
    }
  }


  getHeight = () => {
    if (this.state.isMax) {
      return '100%'
    } else {
      return '45%'
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

    const queryType = this.props.queryGenes.get('queryType')
    const show = this.props.uiState.get('showResult')
    const result = this.props.queryGenes.get('result')

    if(!show || result === null ) {
      // Return empty result
      return(<div></div>)
    }

    const cardStyle = {
      height: this.getHeight(),
      zIndex: '1200',
      width: '100%',
      position: 'fixed',
      margin: 0,
      padding: 0,
      background: '#FFFFFF',
      left: 0,
      bottom: 0,
    }

    const actionStyle = {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'fixed',
      bottom: '1em',
      right: '1em',
      background: 'rgba(0,0,0,0)',

      zIndex: 1300,
    }

    const genesMap = this.props.queryGenes.get('genes')
    const genes = Object.values(genesMap.toJS())

    const genotype = genes.reduce(
      (previousValue, currentValue, index, array) => {
        return previousValue + ", " + currentValue
      }
    )


    const running = this.props.queryGenes.get('running')

    const titleStyle = {
      color: '#26C6DA',
      fontWeight: 700,
      position: 'fixed',
      bottom: '1em',
      left: '1em',
      zIndex: 1210,
      background: 'rgba(0,0,0,0)',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '40%'
    }

    const verticalBarStyle = {
      color: 'black',
      fontWeight: 700,
      position: 'fixed',
      top: 0,
      right: '0.5em',
      zIndex: 1220,
      background: 'rgba(0,0,0,0)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '4em',
      height: '100%'
    }

    const labelStyle = {
      color: '#777777',
      fontSize: '1em',
      fontWeight: 300,
      padding: '0.5em'
    }

    const textStyle = {
      flexGrow: '4',
      width: '20em'
    }

    const legendTitleStyle = {
      color: '#555555',
      width: '30em'
    }


    return (
      <div className={style.container}>

        <div style={titleStyle}>

          <div style={textStyle}>
            {"Deleted Genes: " + genotype}
          </div>

          <h3 style={legendTitleStyle}>Absolute Change in State:</h3>

          <div style={labelStyle}>
            0
          </div>

          <LegendColor />

          <div style={labelStyle}>
            1
          </div>
        </div>


        <div style={verticalBarStyle}>
          {this.getRootLegend(queryType)}
        </div>


        <Card
          style={cardStyle}
        >
          {this.getMainContents(result, running)}

          <CardActions
            style={actionStyle}
          >

            <RaisedButton
              icon={this.state.isMax ? <CollapseIcon /> : <ExpandIcon />}
              onClick={this.toggleWindow}
            />
            <RaisedButton
              icon={<CloseIcon />}
              primary={true}
              onClick={this.handleClose}
            />
          </CardActions>
        </Card>



      </div>
    )
  }

  getRootLegend = resultType => {
    const growthStyle = {
      width: '100%',
      height: '30em',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#777777',
      background: 'linear-gradient(red 0%, white 50%, red 100%)'
    }

    const gradientStyle = {
      width: '100%',
      height: '30em',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: '#777777',
      background: 'linear-gradient(red 0%, white 50%, red 100%)'
    }

    const labelStyle = {
      color: '#777777',
      fontSize: '1em',
      fontWeight: 300
    }

    if (resultType === 'growth') {
      return (
        <RootLegendColor
          min={.5}
          max={1.5}
          gradientStyle={growthStyle}
          labelStyle={labelStyle}
        />
      )
    } else {
      return (
        <RootLegendColor
          min={-1.0}
          max={1.0}
          gradientStyle={gradientStyle}
          labelStyle={labelStyle}
        />
      )
    }
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


  getMainContents = (result, running) => {

    if (result === null || result === undefined) {

      if (running) {
        return (
          <Loading
            style={loaderStyle}
          />
        )
      } else {
        return (
          <div></div>
        )
      }
    } else {

      const w = window.innerWidth
      const h = this.state.isMax ? window.innerHeight : window.innerHeight * 0.4

      const treeStyle = {
        width: w,
        height: h,
        background: '#777777'
      }

      let dag = this.getDag(result)


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

    console.log(newNodes)

    const ndata = cy.collection(newNodes)
    console.log(ndata)

    const newEdges = ndata.connectedEdges()
    console.log(newEdges)

    const cy2 = cytoscape({
      headless: true
    })

    const np = newEdges.connectedNodes()
    cy2.add(np)
    cy2.add(newEdges)

    const newNet = cy2.json()

    console.log('========== New net')
    console.log(newNet)

    return newNet
  }

  getDag = result => {
    console.log('==================DAG *********************************************************************')

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
