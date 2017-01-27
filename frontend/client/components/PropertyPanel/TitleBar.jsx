import React, {Component} from 'react'


class TitleBar extends Component {

  render() {
    const style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: this.props.background,
      textAlign: 'center',
      color: 'white',
      margin: 0,
      padding: '1.7em',
      minHeight: '4em',
    }

    return (
      <div style={style}>
        <h1 style={{textAlign: 'center', lineHeight: 1.3}}>
          {this.props.title}
        </h1>
      </div>
    )
  }
}


TitleBar.defaultProps = {
  background: 'teal',
};

export default TitleBar