import React, {Component} from 'react'
import style from './style.css'
import classnames from 'classnames'

export default class Loading extends Component {

  render() {

    return (
      <div style={this.props.style}>
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

Loading.defaultProps = {
  style: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexFlow: 'row wrap',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
