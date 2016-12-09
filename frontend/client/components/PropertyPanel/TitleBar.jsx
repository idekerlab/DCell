import React, {Component} from 'react'


class TitleBar extends Component {


  componentWillReceiveProps(nextProps) {
    console.log("TITLE NP +++++++++++++++++++++++++++")
    console.log(nextProps)
    console.log(this.state)

  }


  render() {
    const style = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: 'teal',
      height: '6em',

      color: 'white',
      margin: 0,
      paddingLeft: '0.5em'
    }

    console.log(">>>>>>> TITLE >>>>>>>>>")

    return (
      <div style={style}>
        <h2 style={{paddingLeft: '1em'}}>{this.props.title}</h2>
      </div>
    )
  }
}

export default TitleBar