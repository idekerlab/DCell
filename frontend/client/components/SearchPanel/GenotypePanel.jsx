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
      console.log('ZERO!!!!!!!!!!! **********************************************************************************************************************')

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
      margin: '0.3em', fontSize: '0.3em'
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


