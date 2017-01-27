import React, {Component} from 'react'

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import TitleBar from './TitleBar'

import RawInteractionPanel from './RawInteractionPanel'
import GeneList from './GeneList'
import Immutable from 'immutable'
import FilterPanel from './FilterPanel'


import Loading from '../Loading'
import OpenIcon from 'material-ui/svg-icons/action/open-in-new'

import * as d3Scale from 'd3-scale'
import * as d3ScaleChromatic from 'd3-scale-chromatic'

const colorFunction = d3Scale.scaleOrdinal(d3ScaleChromatic.schemeDark2)

const descriptionStyle = {
  background: '#BEBEB4',
  padding: '0.2em'
}

const disabledStyle = {
  background: '#999999'
}


class ClixoDetails extends Component {


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

    this.props.commandActions.filter({
      options: {
        type: 'numeric',
        range: 'edge[score > ' + val + ']'
      },
      target: 'subnet'
    })
  }


  shouldComponentUpdate(nextProps, nextState) {

    if(nextProps.selectedTerm === this.props.selectedTerm) {

      if(nextProps.loading !== this.props.loading) {
        return true
      }

      // Same network data
      if(nextProps.currentProperty.data === this.props.currentProperty.data) {
        if(nextProps.commands === this.props.commands) {
          console.log("%%%%%%%%%%%%%%%% SAME COMMAND data")
          return false;
        } else {
          console.log("%%%%%%%%%%%%%%%% NEW COMMAND")
          return true
        }
      }

    }



    return true
  }


  render() {
    console.log("%%%%%%%%%%%%%%%% Rendering CLIXO Panel")
    console.log(this.props)

    const details = this.props.currentProperty
    if (details === undefined || details === null || details.id === null || details.id === undefined) {
      return (<div></div>)
    }

    // Loading
    if(details.loading) {
      return(<Loading style={descriptionStyle} />)
    }

    const data = details.data._source

    let entry = {}

    let subnet = null

    if (data === undefined) {
      entry = {}
    } else {
      entry = data
      subnet = this.buildNetwork(entry.genes, entry.interactions)
      subnet = Immutable.fromJS(subnet)
    }

    const genes = entry === {} ? [] : entry.genes


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

        <List>
          <ListItem
            key={1}
            secondaryText={'Term ID'}
            primaryText={entry.termid}
          />
        </List>

        <List
          style={descriptionStyle}
        >
          <ListItem
            key={1}
            primaryText={'Aligned Gene Ontology Term'}
            initiallyOpen={true}
            nestedItems={[
              <ListItem
                key={1}
                secondaryText={'GO Term ID'}
                primaryText={entry.go.goid}
                leftIcon={
                  <OpenIcon
                    color={"#FFFFFF"}
                    onTouchTap={this._handleTouchTap.bind(this, entry.go.goid)}
                  />
                }
              />,
              <ListItem
                key={2}
                primaryText={entry.go.definition}
              />,
              <ListItem
                key={3}
                secondaryText={'Score'}
                primaryText={entry.go.score}
              />,
              <ListItem
                key={4}
                secondaryText={'FDR'}
                primaryText={entry.go.fdr}
              />
            ]}/>
        </List>

        < Divider />

        < GeneList
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

    if (interactions === undefined || genes === undefined) {
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


  _handleTouchTap = id => {
    window.open('http://amigo.geneontology.org/amigo/term/' + id);
  }
}

export default ClixoDetails