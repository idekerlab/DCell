import React, {Component} from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'



class NetworkSelector extends Component {


  handleChange = (event, index, value) => {

    // Here, perform cleaning actions for current state
    this.props.propertyActions.clearProperty()

    this.props.messageActions.setMessage('Switching the neural network. This takes 10-20 seconds...')

    this.props.currentNetworkActions.setCurrentNetwork(value)
  }

  render() {
    const networkMap = this.props.trees
    const ids = Object.keys(networkMap)

    const style = {
      color: 'white',
      paddingLeft: '1.2em'
    }

    const selectedStyle = {
      color: 'white',
      fontWeight: 700
    }

    return (
      <SelectField
        labelStyle={selectedStyle}
        style={style}
        onChange={this.handleChange}
        value={this.props.currentNetwork.id}
        floatingLabelText="Neural Network"
        floatingLabelStyle={{color: 'white', fontWeight: 300}}
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


export default NetworkSelector