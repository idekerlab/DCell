import React, { Component } from 'react'

class MinimalGauge extends Component {
  _getPathValues = value => {
    if (value < this.props.min) value = this.props.min
    if (value > this.props.max) value = this.props.max

    var dx = 0
    var dy = 0

    var alpha =
      (1 - (value - this.props.min) / (this.props.max - this.props.min)) *
      Math.PI
    var Ro = this.props.width / 2 - this.props.width / 10
    var Ri = Ro - this.props.width / 6.666666666666667

    var Cx = this.props.width / 2 + dx
    var Cy = this.props.height / 1.25 + dy

    var Xo = this.props.width / 2 + dx + Ro * Math.cos(alpha)
    var Yo = this.props.height - (this.props.height - Cy) - Ro * Math.sin(alpha)
    var Xi = this.props.width / 2 + dx + Ri * Math.cos(alpha)
    var Yi = this.props.height - (this.props.height - Cy) - Ri * Math.sin(alpha)

    return { alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi }
  }

  _getPath = value => {
    const { alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi } = this._getPathValues(value)
    let path = 'M' + (Cx - Ri) + ',' + Cy + ' '
    path += 'L' + (Cx - Ro) + ',' + Cy + ' '
    path += 'A' + Ro + ',' + Ro + ' 0 0 1 ' + Xo + ',' + Yo + ' '
    path += 'L' + Xi + ',' + Yi + ' '
    path += 'A' + Ri + ',' + Ri + ' 0 0 0 ' + (Cx - Ri) + ',' + Cy + ' '
    path += 'Z '

    return path
  }

  render() {
    var topLabelStyle = this.props.topLabelStyle.fontSize
      ? this.props.topLabelStyle
      : { ...this.props.topLabelStyle, fontSize: this.props.width / 10 }
    var valueLabelStyle = this.props.valueLabelStyle.fontSize
      ? this.props.valueLabelStyle
      : { ...this.props.valueLabelStyle, fontSize: this.props.width / 5 }

    const { Cx, Ro, Ri, Xo, Cy, Xi } = this._getPathValues(this.props.max)

    return (
      <svg
        height="100%"
        width="100%"
        style={{
          width: this.props.width,
          height: this.props.height,
          overflow: 'hidden',
          position: 'relative',
          left: 0,
          top: 0
        }}
      >
        <path
          fill={this.props.backgroundColor}
          stroke="none"
          d={this._getPath(this.props.max)}
        />

        <path
          fill={this.props.color}
          stroke="none"
          d={this._getPath(this.props.value)}
        />

        <text
          x={this.props.width / 2}
          y={this.props.height / 8 + this.props.height * 0.15}
          textAnchor="middle"
          style={topLabelStyle}
        >
          {this.props.label}
        </text>
        <text
          x={this.props.width / 2}
          y={this.props.height / 5 * 4}
          textAnchor="middle"
          style={valueLabelStyle}
        >
          {this.props.value + this.props.symbol}
        </text>
        <text
          x={(Cx - Ro + (Cx - Ri)) / 2}
          y={Cy + 25}
          textAnchor="middle"
          style={this.props.minMaxLabelStyle}
        >
          {this.props.min}
        </text>
        <text
          x={(Xo + Xi) / 2}
          y={Cy + 25}
          textAnchor="middle"
          style={this.props.minMaxLabelStyle}
        >
          {this.props.max}
        </text>
      </svg>
    )
  }
}

MinimalGauge.defaultProps = {
  label: 'Cell Growth',
  min: 0,
  max: 100,
  value: 40,
  width: 220,
  height: 170,
  color: '#26A69A',
  symbol: '',
  backgroundColor: '#edebeb',

  topLabelStyle: {
    textAnchor: 'middle',
    fill: '#666666',
    stroke: 'none',
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 100,
    fontStretch: 'normal',
    lineHeight: 'normal',
    fontSize: 14,
    fillOpacity: 1
  },
  valueLabelStyle: {
    textAnchor: 'middle',
    fill: '#333333',
    stroke: 'none',
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 100,
    fontStretch: 'normal',
    lineHeight: 'normal',
    fillOpacity: 1,
    fontSize: 14
  },
  minMaxLabelStyle: {
    textAnchor: 'middle',
    fill: '#999999',
    stroke: 'none',
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontSize: 12,
    lineHeight: 'normal',
    fillOpacity: 1
  }
}

export default MinimalGauge
