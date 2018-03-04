import React from 'react'


const LegendColor = props => {

  return (
    <div style={props.style}></div>
  )
}


LegendColor.defaultProps = {

  style: {
    flexGrow: '3',
    width: '100%',
    height: '1em',
    padding: '0.2em',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#666666',
    background: 'linear-gradient(-90deg, red, white)'
  }
}


export default LegendColor
