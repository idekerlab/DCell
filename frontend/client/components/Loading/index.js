import React, {Component} from 'react'
import style from './style.css'
import classnames from 'classnames'

export default class Loading extends Component {

  render() {
    return (
      <div className={style.grid}>
        <div className={style.loader}>
          <div className={style.square}></div>
          <div className={style.square}></div>
          <div className={classnames(style.square, style.last)}></div>
          <div className={classnames(style.square, style.clear)}></div>
          <div className={style.square}></div>
          <div className={classnames(style.square, style.last)}></div>
          <div className={classnames(style.square, style.clear)}></div>
          <div className={style.square}></div>
          <div className={classnames(style.square, style.last)}></div>
        </div>
      </div>
    )
  }
}

