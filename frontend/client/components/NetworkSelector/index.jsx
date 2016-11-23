import React from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const ontologies = [
  'AtgO v2', 'Merged GO'
]


const handleChange = () => {
  console.log('changed!')
}

const NetworkSelector = props =>

  <SelectField
    style={{paddingLeft: '1.2em'}}
    onChange={handleChange}
    floatingLabelText="Current Ontology"
    floatingLabelStyle={{color: '#666666', fontWeight: 300}}
  >
    {
      ontologies.map(
        (val, i) => {
          return <MenuItem key={i} value={val} primaryText={val}/>
        })
    }
  </SelectField>

export default NetworkSelector