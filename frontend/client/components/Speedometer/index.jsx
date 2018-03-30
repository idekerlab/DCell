import React, { Component } from 'react'
import Gauge from './MinimalGauge'

const rowStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const titleStyle = {
  color: '#777777',
  fontSize: '1em',
  fontWeight: 300,
  fontFamily: 'roboto'
}

class Speedometer extends Component {

  render() {

    let growth = this.props.growth
    const gi = this.props.gi

    if (growth !== undefined) {
      growth = growth.toFixed(3)
    }

    const size = 180
    let width = size * 2
    if (gi === undefined) {
      width = size + 50
    }

    const baseStyle = {
      width: 450,
      height: size * 0.9,
      background: '#FAFAFA',
      position: 'fixed',
      left: 0,
      bottom: 0,
      zIndex: 5500,
      paddingBottom: '1em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }


    const height = size

    return (
      <div style={baseStyle}>
        <div style={rowStyle}>
          <Gauge
            width={size}
            height={height}
            value={growth}
            color={'#66BB6A'}
            label={'Cell Growth'}
            range={[0, 1]}
            min={0}
            max={1.0}
          />

          {gi === undefined ? (
            <div />
          ) : (
            <Gauge
              width={size}
              height={height}
              value={gi}
              label={'Genetic Interaction'}
              range={[0, 1]}
              min={0}
              max={1.0}
            />
          )}
        </div>
      </div>
    )
  }
}

export default Speedometer
