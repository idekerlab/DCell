import React, {Component} from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const style = {
  color: '#777777',
  width: '90%',
}

const selectedStyle = {
  color: '333333',
  fontWeight: 500,
  fontSize: '0.8em'
}


const EXAMPLES = {
  'example0': {
    label: 'Select an example:',
    type: '',
    value: ''
  },
  'example1': {
    label: 'Growth: Delete REV7 and RAD57',
    type: 'growth',
    value: 'REV7 RAD57'
  },
  'example2': {
    label: 'Genetic Interaction: Delete CYT1 and COX7',
    type: 'genetic_interaction',
    value: 'CYT1 COX7'
  }
}


class ExampleQueries extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: 'example0'
    }
  }

  handleChange = (event, index, value) => {
    this.setState({
      value: value
    })

    if(value === 'example0') {
      return
    } else {
      this.props.resetSelectionAction()
      this.props.queryOptionAction(EXAMPLES[value].type)
      this.props.setQueryAction(EXAMPLES[value].value)
    }
  }

  render = () => (
    <SelectField
      value={this.state.value}
      labelStyle={selectedStyle}
      style={style}
      onChange={this.handleChange}
      floatingLabelText="Simulation Examples"
      floatingLabelStyle={{color: '#4444FF', fontWeight: 300}}
    >

      <MenuItem key={1} value='example0' primaryText={EXAMPLES.example0.label}/>
      <MenuItem key={2} value='example1' primaryText={EXAMPLES.example1.label}/>
      <MenuItem key={3} value='example2' primaryText={EXAMPLES.example2.label}/>

    </SelectField>
  )
}

export default ExampleQueries