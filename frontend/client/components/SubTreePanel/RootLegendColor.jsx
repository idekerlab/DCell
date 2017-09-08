import React from 'react'


const RootLegendColor = props => {

  return (

    <div>
      <div style={props.labelStyle}>
        {props.max}
      </div>
      <div style={props.gradientStyle}>

      </div>
      <div style={props.labelStyle}>
        {props.min}
      </div>
    </div>
  )
}


RootLegendColor.defaultProps = {

  gradientStyle: {
    width: '100%',
    height: '20em',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#777777',
    background: 'linear-gradient(red 0%, white 33%, red 66%)'
  }
}


export default RootLegendColor
