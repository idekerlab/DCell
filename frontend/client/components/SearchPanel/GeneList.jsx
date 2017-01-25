import React, {Component} from 'react'

import {List, ListItem} from 'material-ui/List';

import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';

const listStyle = {
  overflow: 'scroll',
  height: '20em',
  background: 'white'
}


class GeneList extends Component {


  constructor(props) {
    super(props);

    this.state = {
      checked: false
    }
  }


  componentWillReceiveProps(nextProps) {
  }


  render() {
    return (
      <List style={listStyle}>
        <Subheader>Search Result</Subheader>
        {this.getGene(this.props.hits)}
      </List>
    )
  }

  getGene = hits => {

    const newList = hits.map((hit, i) => {

      const gene = hit._source
      const symbol = hit._source.symbol
      const locusName = hit._source.locus

      return (
        <ListItem
          key={i}
          leftCheckbox={
            <Checkbox
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

    console.log('Selected: ' + orf)
    console.log(this.props.queryGenes)

    const genes = this.props.queryGenes.get('genes')

    if (genes.has(orf)) {

      console.log("deleting")
      this.props.queryGenesActions.deleteGene(orf)

    } else {

      console.log("adding " + orf)
      this.props.queryGenesActions.addGene(orf)
    }

    console.log(this.props.queryGenes)

  }

}

export default GeneList
