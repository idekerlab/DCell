import React, {Component} from 'react'
import Drawer from 'material-ui/Drawer'
import ClixoDetails from './ClixoDetails'
import GoDetails from './GoDetails'

import CloseIcon from 'material-ui/svg-icons/navigation/close';

const MAX_WIDTH = 800



class PropertyPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false
    };
  }

  handleClose = () => {
    this.setState({
      open: false
    })
  }


  componentWillReceiveProps(nextProps) {
    const selected = this.props.events.get('selected')
    const selectedNew = nextProps.events.get('selected')

    if (selected !== selectedNew) {
      this.setState({
        open: true
      })
    }
  }



  render() {

    const currentNet = this.props.currentNetwork.id

    let w = window.innerWidth * 0.35
    if(w >= MAX_WIDTH) {
      w = MAX_WIDTH
    }

    console.log('PANEL-----------------------------------------------------------------------------------------------------------------------')
    return (
      <Drawer
        width={w}
        openSecondary={true}
        open={this.state.open}>


        <CloseIcon
          style={{position: 'fixed', top: '0.7em', marginLeft: '0.7em', zIndex: 1200}}
          onClick={this.handleClose}
          color={'white'}
        />

        {this.getPanel(currentNet)}

      </Drawer>
    )
  }


  /**
   * Currently supporting two types of networks only.
   */
  getPanel = curNet => {

    if(this.props.currentProperty.id === null) {
      return(<div></div>)
    }

    if(curNet === 'go') {
      return (
        <GoDetails
          {...this.props}
        />
      )
    } else if(curNet === 'clixo') {
      return (
        <ClixoDetails
          {...this.props}
        />
      )
    } else {
      return (<div><h2>Unknown Neural network type</h2></div>)
    }
  }

}

export default PropertyPanel