import React from 'react'


const LegendColor = props => {

  return(
    <canvas
      width={props.width}
      height={props.height}
      style={props.style}
    >

    </canvas>
  )
}

const paint = color => {

  return function(d) {
    var context = this.getContext("2d"),
      image = context.createImageData(width, 1);
    for (var i = 0, j = -1, c; i < width; ++i) {
      c = d3.rgb(color.call(this, d.color(i / width)));
      image.data[++j] = c.r;
      image.data[++j] = c.g;
      image.data[++j] = c.b;
      image.data[++j] = 255;
    }
    context.putImageData(image, 0, 0);
  };
}


LegendColor.defaultProps = {

  style: {
    fill: 'teal',
    stroke: '#777777',
    strokeWidth: 2,
    zIndex: 1500
  },

  width: 500,
  height: 100
}


export default LegendColor
