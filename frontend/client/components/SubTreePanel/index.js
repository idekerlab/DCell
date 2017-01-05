import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import {TreeViewer, DAGViewer} from 'tree-viewer'

const url = 'https://gist.githubusercontent.com/keiono/7ad5071409122c0415ceb41cf35ab8c2/raw/1ef43bc10be4690330ace2a6609a6836d304c791/tree3.json'


class SubTreePanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tree: {}
    };
  }

  componentDidMount() {
    fetch(url)
      .then(response => (response.json()))
      .then(json => {
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^ subtree")
        console.log(json)
        this.setState({tree: json})
      })

  }

  render() {

    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ SUBTREE rendered!")
    const cardStyle ={
      height: '47%',
      zIndex: '1200',
      width: '100%',
      position: 'fixed',
      margin: 0,
      padding: '0.5em',
      background: 'rgba(245,245, 245, 0.9)',
      left: 0,
      bottom: 0,
    }

    const actionStyle = {
      display: 'flex',
      justifyContent: 'flex-end'
    }

    const w = window.innerWidth
    const h = window.innerHeight * 0.35


    const treeStyle = {
      width: w,
      height: h
    }

    return (
      <Card style={cardStyle}>
        <CardHeader
          title="Simulation Result"
          subtitle="Genotype: MATa his3Δ1 leu2Δ0 met15Δ0 ura3Δ0s"
        />


          <TreeViewer
            data={this.state.tree}
            label="long_name"
            style={treeStyle}
          />,

        <CardActions style={actionStyle}>
          <RaisedButton
            label="Close Result"
            secondary={true}
            onClick={this.handleClose}
          />
        </CardActions>
      </Card>
    )
  }

  handleClose = () => {
    this.props.uiStateActions.showResult(false)
  }
}

export default SubTreePanel
