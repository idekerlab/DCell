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

      const symbol = hit._source.symbol
      const locusName = hit._source.locus

      return (
        <ListItem
          key={i}
          leftCheckbox={
            <Checkbox
              onCheck={() => {
                this.itemSelected(symbol)
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

  isChecked = symbol => {
    const genes = this.props.queryGenes.get('genes')

    if (genes.has(symbol)) {
      return true
    }

    return false
  }




  itemSelected = symbol => {

    console.log('Selected: ' + symbol)
    console.log(this.props.queryGenes)

    const genes = this.props.queryGenes.get('genes')

    if (genes.has(symbol)) {

      console.log("deleting")
      this.props.queryGenesActions.deleteGene(symbol)

    } else {

      console.log("adding " + symbol)
      this.props.queryGenesActions.addGene(symbol)
    }

    console.log(this.props.queryGenes)

  }

}

export default GeneList
