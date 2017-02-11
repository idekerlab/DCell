import React, {Component} from 'react';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import {TreeViewer, DAGViewer} from 'tree-viewer'
import Loading from '../Loading'

import ExpandIcon from 'material-ui/svg-icons/navigation/fullscreen'
import CollapseIcon from 'material-ui/svg-icons/navigation/fullscreen-exit'
import CloseIcon from 'material-ui/svg-icons/content/clear'

import Toggle from 'material-ui/Toggle';

// For filtering
import cytoscape from 'cytoscape'




const loaderStyle = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  flexFlow: 'row wrap',
  alignItems: 'center',
  justifyContent: 'center',
}


class SubTreePanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dag: null,
      isMax: false,
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

  shouldComponentUpdate(nextProps, nextState) {
    console.log('==================Checking SHOULD Subtree Panel *********************************************************************')
    const result = this.props.queryGenes.get('result')
    const nextResult = nextProps.queryGenes.get('result')

    console.log(result)
    console.log(nextResult)

    if(this.state.expand !== nextState.expand) {
      console.log("EXPAND!!!!!!!!!!!!!!")
      return true
    }

    if (result === nextResult) {
      console.log("SAME Tree!!!!!!!!!!!!!!")

      if(this.state.filterDag !== null) {
        console.log("FILTER@@@@@@@@@@@@@@@@@@!!!!!!!!!!!!!!")
        return true
      }
      if (this.state.isMax === nextState.isMax) {
        return false
      }

    }

    console.log("Tree Updated !!!!!!!!!!!!!!")
    return true

  }

  componentWillReceiveProps(nextProps) {
    const result = nextProps.queryGenes.get('result')
    if(result === null || result === undefined) {
      return
    }

    const curResult = this.props.queryGenes.get('result')
    const dag = this.getDag(result)
    this.setState({dag: dag})
  }


  render() {

    console.log('==================Subtree Panel *********************************************************************')
    console.log(this.props)


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


    const genes = this.props.queryGenes.get('genes')
    const genotype = genes.reduce(
      (previousValue, currentValue, index, array) => {
        return previousValue + ", " + currentValue
      }
    )


    const result = this.props.queryGenes.get('result')
    const running = this.props.queryGenes.get('running')

    const titleStyle = {
      color: '#26C6DA',
      fontWeight: 700,
      position: 'fixed',
      bottom: '1em',
      left: '1em',
      zIndex: 1210,
      background: 'rgba(0,0,0,0)'

    }

    return (
      <div>
        <div style={titleStyle}>
          {"Deleted Genes: " + genotype}
        </div>

        <Card
          style={cardStyle}
        >
          {this.getMainContents(result, running)}

          <CardActions
            style={actionStyle}
          >
            <Toggle
              label="Show Neurons"
              labelPosition="right"
              style={{maxWidth: 180}}
              onToggle={this.handleToggle}
            />
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


  handleToggle = () => {
    this.setState({expand: !(this.state.expand)})
  }

  toggleWindow = () => {
    this.setState({
      isMax: !this.state.isMax
    })
  }


  handleClose = () => {
    this.props.uiStateActions.showResult(false)
  }

  componentDidUpdate(prevProps, prevState) {
    this.setState({filterDag: null})
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



      let dag = this.state.dag

      if(this.state.filterDag !== null) {
        console.log("###################### FILTER***********************************")
        dag = this.filter(dag, this.state.filterDag.source, this.state.filterDag.target)
      }

      return (
        <DAGViewer
          data={dag}
          label="long_name"
          style={treeStyle}
          expand={this.state.expand}
          nodeSelected={this.nodeSelected}
        />
      )
    }

  }


  nodeSelected = (selectedNode) => {
    console.log('# Node Selected in Application: ')
    console.log(selectedNode) // This is an ID of node


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
            phenotype: node.phenotype
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
