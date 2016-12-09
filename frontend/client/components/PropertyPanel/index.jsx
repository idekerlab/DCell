import React, {Component} from 'react'

import Drawer from 'material-ui/Drawer'

import Details from './Details'



class PropertyPanel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false
    };
  }

  handleClose = () => {
    console.log('- handleClose called!')

    this.setState({
      open: false
    })
  }


  componentWillReceiveProps(nextProps) {
    console.log("=============== ****** PROP PANEL NEXT ********* ==================")

    const selected = this.props.events.get('selected')
    const selectedNew = nextProps.events.get('selected')

    if (selected !== selectedNew) {
      console.log("------------------------>> Open")
      this.setState({
        open: true
      })
    }
  }


  render() {

    console.log("$$$$$$$$$$$$$$$$$$$ PROP Panel rendering $$$$$$$$$$$$$")
    console.log(this.props)

    let w = window.innerWidth * 0.35
    if(w>=800) {
      w = 800
    }

    return (
      <Drawer
        width={w}
        openSecondary={true}
        open={this.state.open}>

        <Details
          {...this.props}
          handleClose={this.handleClose}
        />

      </Drawer>
    )
  }


}

export default PropertyPanel