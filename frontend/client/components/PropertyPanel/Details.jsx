import React, {Component} from 'react'

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import TitleBar from './TitleBar'

import SubNetworkView from './SubNetworkView'
import RawInteractionPanel from './RawInteractionPanel'

import GeneList from './GeneList'

import TreeViewer from 'tree-viewer'



class Details extends Component {


  constructor(props) {
    super(props)
    this.state = {
      subtree: {}
    };
  }


  componentDidMount() {
  }


  render() {
    console.log("%%%%%%%%%%%%%%%% Rendering Details Panel")

    const details = this.props.currentProperty
    const data = details.data._source

    let entry = {}

    if(data === undefined) {
      entry = {}
    } else {
      entry = data
    }

    const genes = entry === {} ? [] : entry.genes
    const subnet = this.buildNetwork(entry.genes, entry.interactions)

    console.log(subnet)


    const descriptionStyle = {
      background: '#F2F2F2',
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
          selectedTerm={this.props.currentProperty._id}
          handleClose={this.props.handleClose}
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
      nodes.push(this.getNode(gene.sgdid, gene.symbol))
    })


    const edges = []

    interactions.map(row => {
      const source = row.source
      const target = row.target

      if(!ids.has(source)) {
        nodes.push(this.getNode(source, source))
      }

      if(!ids.has(target)) {
        nodes.push(this.getNode(target, target))
      }

      const score = row.score
      const type = row.interaction

      const edge = this.getEdge(source, target, score, type)
      edges.push(edge)

    })

    network.elements.nodes = nodes
    network.elements.edges = edges

    return network
  }

  getNode = (sgd, symbol) => {
    return {
      data: {
        id: sgd,
        name: symbol
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