import React, {Component} from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const style = {
  color: '#777777',
  width: '90%'
}

const selectedStyle = {
  color: '333333',
  fontWeight: 500
}


class SimulationTypeSelector extends Component {


  handleChange = (event, index, value) => {
    this.props.queryOptionAction(value)
  }

  render = () => (
    <SelectField
      value={this.props.queryOption}
      labelStyle={selectedStyle}
      style={style}
      onChange={this.handleChange}
      floatingLabelText="Select Phenotype"
      floatingLabelStyle={{color: '#999999', fontWeight: 300}}
      disabled={this.props.disabled}
    >

      <MenuItem key={1} value='growth' primaryText='Growth'/>
      <MenuItem key={2} value='genetic_interaction' primaryText='Genetic Interaction'/>

    </SelectField>
  )
}

export default SimulationTypeSelector