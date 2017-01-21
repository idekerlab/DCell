import React, {Component} from 'react'

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import TitleBar from './TitleBar'

import SubNetworkView from './SubNetworkView'
import RawInteractionPanel from './RawInteractionPanel'

import GeneList from './GeneList'

import Immutable from 'immutable'

import TreeViewer from 'tree-viewer'

import FilterPanel from './FilterPanel'


import * as d3Scale from 'd3-scale'
import * as d3ScaleChromatic from 'd3-scale-chromatic'

const colorFunction = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeDark2)


class Details extends Component {


  constructor(props) {
    super(props)
    this.state = {
      subtree: {},
      scoreFilter: 1.0,
      subnet: {}
    };
  }


  componentDidMount() {
  }

  setScore = (val) => {
    this.setState({scoreFilter: val})
    console.log('New Score: ' + val)

    this.props.commandActions.filter({options: {
      type: 'numeric',
      range: 'edge[score > ' + val + ']'
    }})
  }


  render() {
    console.log("%%%%%%%%%%%%%%%% Rendering Details Panel")

    console.log(this.props)

    const details = this.props.currentProperty
    const data = details.data._source

    let entry = {}

    let subnet = null

    if(data === undefined) {
      entry = {}
    } else {
      entry = data
      subnet = this.buildNetwork(entry.genes, entry.interactions)
      subnet = Immutable.fromJS(subnet)
    }

    const genes = entry === {} ? [] : entry.genes



    const descriptionStyle = {
      background: '#BEBEB4',
      padding: '1em'
    }


    const treeStyle = {
      height: '20em',
      background: 'red'
    }
    return (
      <div>

        <RawInteractionPanel
          subnet={subnet}
          selectedTerm={this.props.currentProperty.id}
          handleClose={this.props.handleClose}
          commandActions={this.props.commandActions}
          loading={this.props.currentProperty.loading}
          colorFunction={colorFunction}
          scoreFilter={this.state.scoreFilter}
          commands={this.props.commands}
        />

        <FilterPanel
          colorFunction={colorFunction}
          setScore={this.setScore}
        />

        <TitleBar
          title={entry.name}
        />

        <div style={descriptionStyle}>
          <h3>{entry.definition}</h3>
        </div>


        <List>
          <ListItem
            key={1}
            secondaryText={'Term ID'}
            primaryText={entry.termid}
          />,
          <ListItem
            key={2}
            secondaryText={'Namespace'}
            primaryText={entry.namespace}
          />
        </List>

        <Divider />

        <GeneList
          genes={genes}
        />
      </div>
    )
  }

  buildNetwork = (genes, interactions) => {


    console.log('------------------------- building Tree')


    const network = {
      data: {name: 'tree'},
      elements: {
        nodes: [],
        edges: []
      }
    }

    if(interactions === undefined || genes === undefined) {
      return network
    }

    const nodes = []

    const ids = new Set()

    genes.map(gene => {
      ids.add(gene.sgdid)
      nodes.push(this.getNode(gene.sgdid, gene.symbol, gene.name))
    })


    const edges = []

    interactions.map(row => {
      const source = row.source
      const target = row.target

      // if(!ids.has(source)) {
      //   nodes.push(this.getNode(source, source))
      // }
      //
      // if(!ids.has(target)) {
      //   nodes.push(this.getNode(target, target))
      // }

      const score = row.score
      const type = row.interaction

      const edge = this.getEdge(source, target, score, type)
      edges.push(edge)

    })

    network.elements.nodes = nodes
    network.elements.edges = edges

    return network
  }

  getNode = (sgd, symbol, name) => {
    return {
      data: {
        id: sgd,
        name: symbol,
        fullName: name
      }
    }
  }

  getEdge = (source, target, score, type) => {
    return {
      data: {
        source: source,
        target: target,
        score: score,
        interaction: type
      }
    }
  }
}

export default Details