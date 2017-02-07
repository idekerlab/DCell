import React, {Component, PropTypes} from 'react'

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import OpenIcon from 'material-ui/svg-icons/action/open-in-new'



class GeneList extends Component {

  render() {

    let genes = this.props.genes
    if(genes === undefined || genes === null) {
      genes = []
    }

    return (

      <List>
        <Subheader>Assigned Genes:</Subheader>

        {
          genes.map((gene, i) => {
            return (
              <ListItem
                key={i}
                hoverColor={'#80CBC4'}
                primaryTogglesNestedList={true}
                primaryText={gene['symbol']}
                nestedItems={[
                  <ListItem
                    key={1}
                    hoverColor={'#FFFFFF'}
                    secondaryText={"Description"}
                    primaryText={gene.name}
                  />,
                  <ListItem
                    key={2}
                    hoverColor={'#FFFFFF'}
                    secondaryText={'SGD ID'}
                    primaryText={gene.sgdid}
                    leftIcon={
                      <OpenIcon
                        color={"#42A5F5"}
                        onTouchTap={this._handleTouchTap.bind(this, gene.sgdid)}
                      />
                    }
                  />
                ]}
              />
            )
          })
        }
      </List>
    )
  }

  _handleTouchTap = id => {
    window.open('http://www.yeastgenome.org/locus/' + id);
  }

}


export default GeneList