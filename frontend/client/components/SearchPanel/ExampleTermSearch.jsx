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
    value: ''
  },
  'example1': {
    label: 'Search terms related to DNA Repair',
    value: 'DNA Repair'
  },
  'example2': {
    label: 'Find terms associated with COX7',
    value: 'COX7'
  }
}


class ExampleTermSearch extends Component {

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
      const val = EXAMPLES[value].value
      this.props.setQueryAction(val)
      this.props.searchAction(val)
    }
  }

  render = () => (
    <SelectField
      value={this.state.value}
      labelStyle={selectedStyle}
      style={style}
      onChange={this.handleChange}
      floatingLabelText="Subsystem Search Examples:"
      floatingLabelStyle={{color: '#999999', fontWeight: 300}}
    >

      <MenuItem key={1} value='example0' primaryText={EXAMPLES.example0.label}/>
      <MenuItem key={2} value='example1' primaryText={EXAMPLES.example1.label}/>
      <MenuItem key={3} value='example2' primaryText={EXAMPLES.example2.label}/>

    </SelectField>
  )
}

export default ExampleTermSearch