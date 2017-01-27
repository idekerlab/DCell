import React, {Component} from 'react'

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TitleBar from './TitleBar'
import GeneList from './GeneList'

import Loading from '../Loading'
import OpenIcon from 'material-ui/svg-icons/action/open-in-new'

const descriptionStyle = {
  background: '#BEBEB4',
  padding: '1em'
}



class GoDetails extends Component {

  constructor(props) {
    super(props)
    this.state = {
      subtree: {},
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextDetails = nextProps.currentProperty
    const details = this.props.currentProperty

    if (details.id === nextDetails.id && details.loading === nextDetails.loading) {
      console.log('SAME GO -----------------------------------------------------------------------------------------------------------------------')
      return false
    }

    console.log("diff GO")
    return true
  }


  render() {
    console.log("%%%%%%%%%%%%%%%% Rendering GO Details Panel")
    console.log(this.props)

    const details = this.props.currentProperty

    if (details === undefined || details === null || details.id === null || details.id === undefined) {
      return (<div></div>)
    }

    // Loading
    if(details.loading) {
      return(<Loading />)
    }


    const curNetId = this.props.currentNetwork.id
    const curTree = this.props.trees[curNetId]

    const namespace = curTree.properties.namespace

    const data = details.data._source

    let entry = {}


    let nsColor = 'teal'

    if (data === undefined) {
      entry = {}
    } else {
      entry = data
      nsColor = namespace[entry.namespace].color
    }

    const genes = entry === {} ? [] : entry.genes



    return (
      <div>
        <TitleBar
          background={nsColor}
          title={entry.name}
        />

        <div style={descriptionStyle}>
          <h3>{entry.definition}</h3>
        </div>


        <List>
          <ListItem
            key={1}
            secondaryText={'Term ID'}
            primaryText={entry.termid}
            hoverColor={'#FFFFFF'}
            leftIcon={
              <OpenIcon
                color={"#42A5F5"}
                onTouchTap={this._handleTouchTap.bind(this, entry.termid)}
              />
            }
          />,
          <ListItem
            key={2}
            secondaryText={'Namespace'}
            primaryText={entry.namespace}
            hoverColor={'#FFFFFF'}
          />
        </List>

        <Divider />

        <GeneList
          genes={genes}
        />
      </div>
    )
  }

  _handleTouchTap = id => {
    window.open('http://amigo.geneontology.org/amigo/term/' + id);
  }

}

export default GoDetails