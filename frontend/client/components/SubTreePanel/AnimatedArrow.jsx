import React from 'react'
import style from './style.css'


const AnimatedArrow = props =>
  <div className={style.arrowLogo}>
    <div className={style.arrowSliding}>
      <div className={style.arrow}/>
    </div>
    <div className={style.delay1}>
      <div className={style.arrow}/>
    </div>
    <div className={style.delay2}>
      <div className={style.arrow}/>
    </div>
    <div className={style.delay3}>
      <div className={style.arrow}/>
    </div>
  </div>


export default AnimatedArrow
