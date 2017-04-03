import React, {Component} from 'react'
import Chip from 'material-ui/Chip';


const style = {
  background: 'white',
  padding: 0,
}

const containerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
}


class GenotypePanel extends Component {


  render() {
    const genes = this.props.genes

    if(genes === undefined || genes.size === 0) {
      return (
        <div style={style}>
        </div>
      )
    }

    return (
      <div style={style}>
        <h4>Genotype:</h4>

        <div style={containerStyle}>
          {this.getGenes(this.props.genes.toJS())}
        </div>
      </div>
    )

  }


  getGenes = genes => {
    const orfs = Object.keys(genes)

    console.log(genes)
    console.log(orfs)

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


