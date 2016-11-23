import React, {Component} from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


const style = {
  color: '#555555',
  fontWeight: 600
}

class StyleSelector extends Component {

  handleChange = (event, index, value) => {
    this.props.currentVsActions.setCurrentVs(value)
  }

  render() {
    let currentVsName = this.props.currentVs.get('vsName')
    if(this.props.styles.get(currentVsName) === undefined) {
      currentVsName = 'default'
    }
    const styleNames = this.props.styles.keys()

    const items = []

    let count = 1
    for (let styleName of styleNames) {
      items.push(<MenuItem key={count} value={styleName} primaryText={styleName}/>)
      count++
    }

    return (
      <SelectField
        style={{paddingLeft: '1.2em'}}
        labelStyle={style}
        value={currentVsName}
        onChange={this.handleChange}
        floatingLabelText="Current Visual Style"
        floatingLabelStyle={{color: '#666666', fontWeight: 300}}
      >
        {items}
      </SelectField>
    )
  }
}

export default StyleSelector