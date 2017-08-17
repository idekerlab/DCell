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


  constructor(props) {
    super(props)
    this.state = {
      value: 'growth'
    }
  }

  handleChange = (event, index, value) => {
    console.log('type selected: ' + value)
    this.setState({
      value: value
    })
    this.props.queryOptionAction(value)
  }

  render = () => (
    <SelectField
      value={this.state.value}
      labelStyle={selectedStyle}
      style={style}
      onChange={this.handleChange}
      floatingLabelText="Select Phenotype"
      floatingLabelStyle={{color: '#999999', fontWeight: 300}}
    >

      <MenuItem key={1} value='growth' primaryText='Growth'/>
      <MenuItem key={2} value='genetic_interaction' primaryText='Genetic Interaction'/>

    </SelectField>
  )
}

export default SimulationTypeSelector