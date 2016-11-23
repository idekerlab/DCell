import React, {Component} from 'react'

import Title from './Title'
import Footer from './Footer'

import style from './style.css'


export default class TopPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }


  render() {
    const {
      currentNetwork, networkSourceActions,
      datasourceActions
    } = this.props
    return (
      <div>
        <div className={style.top}>
          <Title
            currentNetwork={currentNetwork}
            networkSourceActions={networkSourceActions}
            datasourceActions={datasourceActions}
          />
        </div>

        <Footer/>
      </div>
    )
  }
}
