import React, {Component} from 'react'

import * as colors from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import SearchIcon from 'material-ui/svg-icons/action/search';
import ListIcon from 'material-ui/svg-icons/action/list';

import Chip from 'material-ui/Chip';


class GenotypePanel extends Component {


  render() {

    const style = {
      background: 'white',
      padding: 0,
    }

    const containerStyle = {
      display: 'flex',
      flexWrap: 'wrap',
    }

    const genes = this.props.genes

    if(genes === undefined || genes.length === 0) {
      return (
        <div style={style}>
        </div>
      )
    }


    return (
      <div style={style}>
        <h3>Genotype:</h3>
        <div style={containerStyle}>
          {this.props.genes.map(this.renderGene, this)}
        </div>
      </div>
    )

  }

  renderGene = data => {

    const chipStyle = {
      margin: '0.3em',fontSize: '0.3em'
    }

    return (
      <Chip
        key={data}
        onRequestDelete={() => this.handleDelete(data)}
        style={chipStyle}
      >
        {data.toLowerCase() + 'Δ'}
      </Chip>
    );
  }

  handleDelete = key => {
    this.chipData = this.props.genes;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(key);
    this.chipData.splice(chipToDelete, 1);
    this.setState({chipData: this.chipData});
  };

}

export default GenotypePanel


