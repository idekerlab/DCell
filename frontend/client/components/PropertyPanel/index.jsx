import React, {Component} from 'react'

import TitleBar from './TitleBar'
import * as colors from 'material-ui/styles/colors';
import Drawer from 'material-ui/Drawer'
import {List, ListItem} from 'material-ui/List';

import CyViewer from 'cy-viewer'

class PropertyPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      subTree: null
    };
  }

  handleClose = () => {
    console.log('- handleClose called!')

    this.setState({
      open: false
    })
  }


  componentWillReceiveProps(nextProps, nextState) {
    const data = nextProps.property

    if (data !== null && data.id !== null) {

      const properties = data.properties
      const tree = this.buildNetwork(data.id, properties.children, properties.parents)
      this.setState({subTree: tree})
    } else {
      const tree = {
        data: {name: 'tree'},
        elements: {
          nodes: [{data: {id: 'EEEEEEEEEEEEE', name: 'BBBBBBBBBBBBBB'}}],
          edges: []
        }
      }
      this.setState({subTree: tree})
    }
    console.log("Sub view==================")
    console.log(this.state.subTree)

    let id = data.id
    if (id !== null) {
      this.setState({
        open: true
      })
    } else {
      this.setState({
        open: false
      })
    }
    console.log("------------------------- WILL Done==================")
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   const id = nextProps.property.id
  //
  //   if(id === null) {
  //     return false
  //   }
  //
  //   if(id === this.props.property.id) {
  //     return false
  //   }
  //
  //   return true
  // }

  render() {

    console.log("-------------- %%%%%%%%%%%%PROP Panel rendering")

    let w = window.innerWidth * 0.35
    if(w>=800) {
      w = 800
    }

    const treeData = this.state.subTree


    let data = this.props.property
    console.log(data)


    let name = 'N/A'
    let keys = []
    let properties = {}

    if (data !== null && data.id !== null) {

      properties = data.properties
      name = properties.name
      keys = Object.keys(properties)
    }

    console.log("Step 2==================")
    console.log(keys)
    console.log(properties)

    const networkAreaStyle = {
      width: '100%',
      height: '45%',
      background: colors.blueGrey800
    };

    const networkAreaStyleChild = {
      width: '100%',
      height: '100%'
    };


    console.log("Last Step 2==================")
    console.log(treeData)
    return (
      <Drawer
        width={w}
        openSecondary={true}

        open={this.state.open}>


        <div style={networkAreaStyle}>
          <CyViewer
            key={String(new Date())}
            network={treeData}
            networkType={'cyjs'}
            style={networkAreaStyleChild}
            rendererOptions={{layout: 'concentric'}}
          />
        </div>


        <TitleBar
          title={name}
          closeAction={this.handleClose}
        />

        <List>
          {
            keys.map((keyVal, i) => {
              return <ListItem
                key={i}
                secondaryText={keyVal}
                primaryText={String(properties[keyVal])}
              />
            })
          }
        </List>
      </Drawer >
    )
  }

  buildNetwork = (root, children, parents) => {

    const network = {
      data: {name: 'tree'},
      elements: {
        nodes: [],
        edges: []
      }
    }
    const rootNode = {
      data: {
        id: root,
        name: root
      }
    }
    network.elements.nodes.push(rootNode)

    children.map((val, i) => {
      const node = {
        data: {
          id: val.id,
          name: val.name
        }
      }

      const edge = {
        data: {
          source: root,
          target: val.id
        }
      }

      console.log("Adding %%%%%%%%%%%%" + val.id)
      network.elements.nodes.push(node)
      network.elements.edges.push(edge)
    })

    return network
  }

}

export default PropertyPanel