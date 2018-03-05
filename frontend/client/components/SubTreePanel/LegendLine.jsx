import React from 'react'


const wrapperStyle = {
  flexGrow: '6',
  width: '100%',
  height: '1em',
  display: 'inline-flex',
  fontSize: '0.3em',
  color: '#444444',
  marginLeft: '2em',

}

const primary = {
  width: '10em',
  paddingTop: '0.5em',
  borderTop: '2px solid #333333',
}

const others = {
  width: '10em',
  marginLeft: '1em',
  paddingTop: '0.5em',
  borderTop: '2px dotted #333333',
}

const LegendLine = () => {

  return (
    <div style={wrapperStyle}>

      <div style={primary}>Primary path</div>
      <div style={others}>Other paths</div>
    </div>
  )
}

export default LegendLine