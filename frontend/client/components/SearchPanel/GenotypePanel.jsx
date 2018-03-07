import React, {Component} from 'react'
import Chip from 'material-ui/Chip';


const style = {
  padding: 0,
  margin: 0
}

const containerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  maxHeight: '10em',
  overflowY: 'scroll'
}

const titleStyle = {
  fontSize: '1.2em',
  paddingTop: '0.2em',
  paddingBottom: '0.2em',
  color: '#444444'
}


class GenotypePanel extends Component {


  render() {
    const genes = this.props.genes

    if(genes === undefined || genes.size === 0) {
      return (
        <div style={style}>
          <div style={titleStyle}>Genotype:</div>
          <div style={containerStyle}>

          </div>
        </div>
      )
    }

    return (
      <div style={style}>
        <div style={titleStyle}>Genotype:</div>
        <div style={containerStyle}>
          {this.getGenes(this.props.genes.toJS())}
        </div>
      </div>
    )

  }


  getGenes = genes => {
    const orfs = Object.keys(genes)
    return orfs.map(orf => (this.renderGene(orf, genes[orf])))
  }

  renderGene = (orf, symbol) => {

    const chipStyle = {
      margin: '0.3em', fontSize: '0.3em'
    }

    return (
      <Chip
        key={orf}
        onRequestDelete={() => this.handleDelete(orf)}
        style={chipStyle}
      >
        {orf.toLowerCase() + 'Δ' + ' (' + symbol + ')'}
      </Chip>
    );
  }

  handleDelete = key => {
    this.props.queryGenesActions.deleteGene(key)
  };

}

export default GenotypePanel


