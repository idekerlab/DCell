import React from 'react'

import Loading from '../Loading'


const style = {
  height: '100%',
  width: '100%',
  backgroundColor: 'rgba(0,0,0, 0.2)',
  zIndex: '2000'
}


const RunningOverlay = props => (
  <div style = {style}>
    <Loading />
  </div>
)


export default RunningOverlay