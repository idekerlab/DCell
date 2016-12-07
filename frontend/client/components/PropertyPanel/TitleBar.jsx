import React, {Component} from 'react'

import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/action/home';

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
      height: '4em',

      color: 'white',
      margin: 0,
      paddingLeft: '0.5em'
    }

    const iconStyle = {
      color: 'white',
    }

    return (
      <div style={style}>
        <IconButton
          onClick={this.handleClick}
          iconStyle={iconStyle}
        >
          <CloseIcon/>
        </IconButton>

        <h1>{this.props.title}</h1>
      </div>
    )
  }
}

export default TitleBar