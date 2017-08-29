import React, {Component} from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'


class StructureSelectorPanel extends Component {


  handleChange = (event, index, value) => {
    // Here, perform cleaning actions for current state
    this.props.propertyActions.clearProperty()
    // this.props.messageActions.setMessage('Switching the neural network. This takes 10-20 seconds...')
    this.props.currentNetworkActions.setCurrentNetwork(value)
  }

  render() {
    const networkMap = this.props.trees
    const ids = Object.keys(networkMap)

    const style = {
      color: '#777777',
      width: '90%'
    }

    const selectedStyle = {
      color: '333333',
      fontWeight: 500
    }

    return (
      <SelectField
        labelStyle={selectedStyle}
        style={style}
        onChange={this.handleChange}
        value={this.props.currentNetwork.id}
        floatingLabelText="Structural Hierarchy"
        floatingLabelStyle={{color: '#999999', fontWeight: 300}}
      >
        {
          ids.map(
            (val, i) => {
              return <MenuItem key={i} value={val} primaryText={networkMap[val].name}/>
            })
        }
      </SelectField>
    )
  }
}


export default StructureSelectorPanel