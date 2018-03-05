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

      <AnimatedArrow/>

      <div className={style.logocontainer}>
        <div className={style.title}>
          Please build a list of genes to be deleted with Genotype Builder
        </div>
        <img style={logoStyle} src={logo}/>
      </div>
    </div>
  )
}

export default DefaultPanel
