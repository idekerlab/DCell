import React from 'react'


const LegendColor = props => {

  return(
    <div
      style={props.style}
    >
    </div>
  )
}


LegendColor.defaultProps = {

  style: {
    width: '100%',
    height: '500px',
    backgroundColor: 'orange',
  }
}


export default LegendColor
