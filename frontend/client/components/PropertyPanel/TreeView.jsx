import React, {Component} from 'react'


class TreeView extends Component {

  render() {

    let genes = this.props.genes
    if(genes === undefined || genes === null) {
      genes = []
    }

    return (
      <div></div>

    )
  }

}

export default TreeView
