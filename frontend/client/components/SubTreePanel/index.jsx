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



    const genes = this.props.queryGenes.get('genes')
    const genotype = genes.reduce(
      (previousValue, currentValue, index, array) => {
        return previousValue + ", " + currentValue
      }
    )


    console.log('==================DAG 0 *********************************************************************')
    console.log(this.props)

    const result = this.props.queryGenes.get('result')

    return (
      <Card style={cardStyle}>
        <CardHeader
          title="Gene Deletion Simulation Result"
          subtitle={"Genotype: "}
        />

          {this.getMainContents(result)}

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

  getMainContents = (result) => {
    if(result === null || result === undefined) {
      return (<h2>Loading...</h2>)
    } else {

      const w = window.innerWidth
      const h = window.innerHeight * 0.35

      const treeStyle = {
        width: w,
        height: h
      }

      const dag = this.getDag(result)

      return(
        <DAGViewer
          data={dag}
          label="long_name"
          style={treeStyle}
        />
      )
    }

  }

  getDag = result => {
    console.log('==================DAG *********************************************************************')
    console.log(result)

    const net = {
      data: {
        name: 'simulation result'
      },
      elements: {
        nodes:[],
        edges:[]
      }
    }

    if(result === null || result === undefined) {
      return net
    }

    const nodes = result.data.nodes.map(node => ({
      data: {
        id: node.id,
        type: 'term',
        name: node.id
      }
    }))
    const edges = result.data.edges.map(edge => ({data: edge}))

    net.elements.nodes = nodes
    net.elements.edges = edges

    console.log(net)

    return net



    // Convert dag to renderable form


  }
}

export default SubTreePanel
