import React, {Component} from 'react'

import IconButton from 'material-ui/IconButton';
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
      width: '100%',
      height: '6em',

      color: 'white',
      margin: 0,
      paddingLeft: '0.5em'
    }

    const iconStyle = {
      color: 'teal',
    }

    return (
      <div style={style}>
        <FloatingActionButton
          onClick={this.handleClick}
          iconStyle={iconStyle}
          backgroundColor="#EFEFEF"
        >
          <CloseIcon/>
        </FloatingActionButton>

        <h2 style={{paddingLeft: '1.5em'}}>{this.props.title}</h2>
      </div>
    )
  }
}

export default TitleBar