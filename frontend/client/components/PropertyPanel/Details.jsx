import React, {Component} from 'react'

import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

import TitleBar from './TitleBar'

import SubNetworkView from './SubNetworkView'
import GeneList from './GeneList'


class Details extends Component {


  render() {

    const details = this.props.currentProperty
    const data = details.data._source

    let entry = {}

    if(data === undefined) {
      entry = {}
    } else {
      entry = data
    }

    console.log("%%%%%%%%%%%%%%%% Details Panel")


    const descriptionStyle = {
      background: '#F2F2F2',
      padding: '1em'
    }

    return (
      <div>
        {/*<SubNetworkView*/}
          {/*currentProperty={this.props.currentProperty}*/}
          {/*handleClose={this.props.handleClose}*/}
        {/*/>*/}

        <TitleBar
          title={entry.name}
        />

        <div style={descriptionStyle}>
          <h3>{entry.name}</h3>
        </div>


        <List>
          <ListItem
            key={1}
            secondaryText={'Term ID'}
            primaryText={entry.termid}
          />,
          <ListItem
            key={2}
            secondaryText={'Namespace'}
            primaryText={entry.namespace}
          />
        </List>

        <Divider />

        <GeneList
          genes={[]}
        />
      </div>
    )
  }
}

export default Details