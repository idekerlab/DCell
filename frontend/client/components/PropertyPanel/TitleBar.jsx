import React, {Component} from 'react'


class TitleBar extends Component {

  render() {
    const style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: 'teal',

      color: 'white',
      margin: 0,
      paddingLeft: '0.5em'
    }

    return (
      <div style={style}>
        <h2 style={{paddingLeft: '1em'}}>
          {this.props.title}
        </h2>
      </div>
    )
  }
}

export default TitleBar