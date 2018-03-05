import React from 'react'

import style from './style.css'

const wrapperStyle = {
  flexGrow: '3',
  width: '100%',
  height: '1em',
}

const LegendColor = props => {

  return (

    <div style={wrapperStyle}>
      <div className={style.tooltip}>
        <div style={props.style}>
        </div>
        <span className={style.tooltiptext}>
          The change in state is defined as a z-score,
          with the center defined as the wildtype state
          and the standard deviation calculated across
          the simulated states of all double knockout genotypes
        </span>
      </div>
    </div>
  )
}


LegendColor.defaultProps = {

  style: {
    width: '100%',
    height: '1em',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#666666',
    background: 'linear-gradient(-90deg, red, white)'
  }
}


export default LegendColor
