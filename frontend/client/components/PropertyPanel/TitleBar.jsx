import React, {Component} from 'react'

import FloatingActionButton from 'material-ui/FloatingActionButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

class TitleBar extends Component {

  handleClick = () => {
    console.log('- click')
    this.props.closeAction()
  }

  render() {

    const style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: 'teal',
      height: '6em',

      color: 'white',
      margin: 0,
      paddingLeft: '0.5em'
    }


    return (
      <div style={style}>
        <h2 style={{paddingLeft: '1em'}}>{this.props.title}</h2>
      </div>
    )
  }
}

export default TitleBar