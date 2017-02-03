import React, {Component} from 'react';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import {TreeViewer, DAGViewer} from 'tree-viewer'
import Loading from '../Loading'

import ExpandIcon from 'material-ui/svg-icons/navigation/fullscreen'
import CollapseIcon from 'material-ui/svg-icons/navigation/fullscreen-exit'
import CloseIcon from 'material-ui/svg-icons/content/clear'

import Toggle from 'material-ui/Toggle';


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
      tree: {},
      isMax: false
    };
  }


  getHeight = () => {
    if (this.state.isMax) {
      return '100%'
    } else {
      return '45%'
    }
  }

  getIcon = () => {
    if (this.state.isMax) {
      return(<CollapseIcon />)
    } else {
      return(<ExpandIcon />)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('==================Checking SHOULD Subtree Panel *********************************************************************')
    const result = this.props.queryGenes.get('result')
    const nextResult = nextProps.queryGenes.get('result')

    console.log(result)
    console.log(nextResult)

    if (result === nextResult) {
      console.log("SAME Tree!!!!!!!!!!!!!!")

      if (this.state.isMax === nextState.isMax) {
        return false
      }
    }

    console.log("Tree Updated !!!!!!!!!!!!!!")
    return true

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

      const dag = this.getDag(result)

      return (
        <DAGViewer
          data={dag}
          label="long_name"
          style={treeStyle}
        />
      )
    }

  }

  getDag = result => {
    console.log('==================DAG *********************************************************************')
    console.log(result)

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

      console.log(node)

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
            score: node.importance
          }
        }
      }

    })
    const edges = result.data.edges.map(edge => ({data: edge}))

    net.elements.nodes = nodes
    net.elements.edges = edges

    console.log(net)

    return net
  }
}

export default SubTreePanel
