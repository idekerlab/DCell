import React, { Component } from 'react'
import Gauge from './MinimalGauge'

import Meter from './Meter'

const baseStyle = {
  width: '450px',
  height: '200px',
  background: '#FFFFFF',
  position: 'fixed',
  right: '1em',
  top: '4.5em',
  borderRadius: '20px',
  zIndex: 1500,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column'
}

const rowStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const titleStyle = {
  color: '#666666',
  fontSize: '0.6em'
}

class Speedometer extends Component {


  state = {
    val1: Math.random() * 100,
    val2: Math.random() * 100
  }

  componentDidMount() {
    // Meter(this.meter, this.props)
  }

  handleClick = () => {
    this.setState({
      val1: Math.random() * 100,
      val2: Math.random() * 100
    })

  }

  render() {
    console.log(this.props)

    const growth = this.props.growth
    const gi = this.props.gi

    let opts = {
      size: 140,
      tickColor: '#00aaFF',
      progressColor: '#009688'
    }

    return (
      <div style={baseStyle}>
        <div
          style={rowStyle}
          onClick={this.handleClick}
        >
          <Gauge
            value={growth}
            color={'#66BB6A'}
            label={'Cell Growth'}
            range={[0, 1]}
            min={0}
            max={1.0}
          />
          <Gauge
            value={gi}
            label={'Genetic Interaction'}
            range={[0, 1]}
            min={0}
            max={1.0}
          />
        </div>
      </div>
    )
  }
}

export default Speedometer
