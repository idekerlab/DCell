import React, {Component} from 'react'
import * as colors from 'material-ui/styles/colors';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import CyViewer from 'cy-viewer'


class SubNetworkView extends Component {

  render() {

    const style = {
      width: '100%',
      height: '50em',
      background: colors.blueGrey50
    }

    const networkAreaStyle = {
      width: '100%',
      height: '100%',
      top: 0,
      right: 0,
      position: 'relative'
    }

    const iconStyle = {
      color: 'white',
    }

    const subnet = this.buildNetwork()

    return (
      <div style={style}>

        <CyViewer
          key="subview"
          network={subnet}
          networkType={'cyjs'}
          style={networkAreaStyle}
          rendererOptions={{layout: 'grid'}}
        />

        <FloatingActionButton
          style={{position: 'fixed', top: '0.7em', marginLeft: '0.7em', zIndex: 999}}
          onClick={this.props.handleClose}
          iconStyle={iconStyle}
          mini={true}
        >
          <CloseIcon/>
        </FloatingActionButton>
      </div>
    )
  }

  buildNetwork = () => {

    const details = this.props.currentProperty.data
    const root = this.props.currentProperty.id

    console.log('------------------------- building SUB')
    const network = {
      data: {name: 'tree'},
      elements: {
        nodes: [],
        edges: []
      }
    }

    if(root=== undefined || root === null) {
      return network
    }


    const rootNode = {
      data: {
        id: root,
        name: root
      }
    }

    network.elements.nodes.push(rootNode)

    if(details === undefined || details === null) {
      return network
    }

    const children = details.children
    const parents = details.parents


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


export default SubNetworkView
