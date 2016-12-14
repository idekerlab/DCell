import React, {Component} from 'react'

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import TitleBar from './TitleBar'

import SubNetworkView from './SubNetworkView'
import GeneList from './GeneList'

import TreeViewer from 'tree-viewer'



const url = 'https://gist.githubusercontent.com/keiono/a6509b60401f247ba054dd82011137d9/raw/c395a89cac35559f4b2313fce49bb99dbc18918d/subnet-d3.json'

class Details extends Component {


  constructor(props) {
    super(props)
    this.state = {
      subtree: {}
    };
  }


  componentDidMount() {
    fetch(url)
      .then(response => (response.json()))
      .then(json => {
        this.setState({subtree: json})
        console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT SUBT')
        console.log(json)
      })
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
    const subnet = this.buildNetwork(details.id, data)

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
        <SubNetworkView
          subnet={subnet}
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

  buildNetwork = (root, details) => {


    console.log('------------------------- building Tree')


    const network = {
      data: {name: 'tree'},
      elements: {
        nodes: [],
        edges: []
      }
    }

    if(root=== undefined || root === null) {
      return network
    }

    const rootNode = {
      data: {
        id: root,
        name: root
      }
    }

    network.elements.nodes.push(rootNode)

    if(details === undefined || details === null || details === {}) {
      return network
    }

    let children = details.children
    if(children === undefined) {
      children = []
    }

    let parents = details.parents
    if(parents === undefined) {
      parents = []
    }

    children.map((val, i) => {
      const node = this.getNode(val)
      const edge = this.getEdge(root, val.id)

      console.log("Adding %%%%%%%%%%%%" + val.id)
      network.elements.nodes.push(node)
      network.elements.edges.push(edge)
    })

    return network
  }

  getNode = val => {
    return {
      data: {
        id: val.id,
        name: val.name
      }
    }
  }

  getEdge = (source, target) => {
    return {
      data: {
        source: source,
        target: target
      }
    }
  }
}

export default Details