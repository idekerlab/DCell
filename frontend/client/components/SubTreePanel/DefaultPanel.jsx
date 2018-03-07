import React from 'react'

import logo from './default.svg'

import style from './style.css'
import AnimatedArrow from './AnimatedArrow'

const logoStyle = {
  width: '100%'
}

const DefaultPanel = props => {
  return (
    <div className={style.treecontainer}>
      <div className={style.arrowWrapper}>
        <AnimatedArrow />
      </div>

      <div className={style.logoarea}>
        <div className={style.logocontainer}>
          <img style={logoStyle} src={logo} />
        </div>
      </div>
    </div>
  )
}

export default DefaultPanel
