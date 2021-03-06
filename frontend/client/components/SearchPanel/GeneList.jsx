import React, { Component, PropTypes } from 'react'

import { List, ListItem } from 'material-ui/List'

import Subheader from 'material-ui/Subheader'
import Checkbox from 'material-ui/Checkbox'

const listStyle = {
  overflow: 'scroll',
  height: '100%',
  width: '100%',
  background: 'inherit'
}

class GeneList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      disabled: false
    }
  }

  render() {
    const subheaderStyle = {
      padding: '0.5em',
      paddingRight: 0,
      margin: 0,
      lineHeight: '1.5em'
    }

    return (
      <List style={listStyle}>
        <Subheader style={subheaderStyle}>
          Search Result (Click to select genotype)
        </Subheader>
        {this.getGene(this.props.hits)}
      </List>
    )
  }

  getGene = hits => {
    const selectedGenes = this.props.queryGenes.get('genes')

    //Filter
    const newList = hits.map((hit, i) => {
      const gene = hit._source
      const symbol = hit._source.symbol
      const locusName = hit._source.locus
      const checked = selectedGenes.has(locusName)

      let disabled = false
      const queryOption = this.props.queryOption

      if (selectedGenes.size >= 2 && queryOption === 'genetic_interaction') {
        disabled = true
      }

      return (
        <ListItem
          key={i}
          style={{ paddingBottom: 0 }}
          leftCheckbox={
            <Checkbox
              disabled={disabled}
              checked={checked}
              onCheck={() => {
                this.itemSelected(gene)
              }}
            />
          }
          primaryText={symbol + '  (' + locusName + ')'}
          secondaryText={hit._source.name}
        />
      )
    })

    return newList
  }

  itemSelected = gene => {
    const orf = gene.locus
    const geneName = gene.symbol

    console.log('Selected: ' + orf)
    console.log(this.props.queryGenes)

    const genes = this.props.queryGenes.get('genes')

    if (genes.has(orf)) {
      console.log('deleting')
      this.props.queryGenesActions.deleteGene(orf)
    } else {
      console.log('adding ' + orf)
      this.props.queryGenesActions.addGene([orf, geneName])
    }

    console.log(this.props.queryGenes)
  }
}

export default GeneList
