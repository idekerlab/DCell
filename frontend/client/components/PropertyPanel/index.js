import React, {Component} from 'react'

import TitleBar from './TitleBar'
import * as colors from 'material-ui/styles/colors';
import Drawer from 'material-ui/Drawer'
import {List, ListItem} from 'material-ui/List';


class PropertyPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
    };
  }

  handleClose = () => {
    console.log('- handleClose called!')

    this.setState({
      open: false
    })
  }


  componentWillReceiveProps(nextProps, nextState) {
    const details = nextProps.events
    let data = details.get('selected')
    if (data !== null) {
      this.setState({
        open: true
      })
    } else {
      this.setState({
        open: false
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  render() {

    console.log("-------------- %%%%%%%%%%%%PROP Panel rendering")

    let w = window.innerWidth * 0.35
    if(w>=800) {
      w = 800
    }


    let data = this.props.events.get('selected')
    let name = 'N/A'
    let keys = []

    if (data !== null) {
      name = data.name
      keys = Object.keys(data)
    }

    const networkAreaStyle = {
      width: '100%',
      height: '45%',
      background: colors.blueGrey800
    };

    return (
      <Drawer
        width={w}
        openSecondary={true}

        open={this.state.open}>


        <div style={networkAreaStyle}></div>


        <TitleBar
          closeAction={this.handleClose}
        />

        <List>
          {
            keys.map((keyVal, i) => {
              return <ListItem
                key={i}
                secondaryText={keyVal}
                primaryText={data[keyVal]}
              />
            })
          }
        </List>
      </Drawer >
    )
  }
}

export default PropertyPanel