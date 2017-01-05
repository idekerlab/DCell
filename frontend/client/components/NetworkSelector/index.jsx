import React, {Component} from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'



class NetworkSelector extends Component {


  handleChange = (event, index, value) => {
    window.setTimeout(() => {
      this.props.currentNetworkActions.setCurrentNetwork(value)
    }, 20)
  }

  render() {

    console.log('SELECTOR TREE')
    console.log(this.props)

    const networkMap = this.props.trees
    const ids = Object.keys(networkMap)

    return (
      <SelectField
        style={{paddingLeft: '1.2em'}}
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