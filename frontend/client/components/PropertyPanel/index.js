import React, {Component} from 'react'

import CyViewer from 'cy-viewer'

import TitleBar from './TitleBar'

import * as colors from 'material-ui/styles/colors';

import Drawer from 'material-ui/Drawer'
import {List, ListItem} from 'material-ui/List';

const cyjsUrl = 'https://raw.githubusercontent.com/cytoscape/cyREST/master/examples/python/basic/sample_data/yeast_network.json'

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


  // componentWillMount() {
    // this.props.downloadActions.downloadBegin()
    // this.props.downloadActions.fetchNetwork(cyjsUrl)
  // }

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