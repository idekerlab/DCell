import React, {Component} from 'react'

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';


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
                primaryText={gene['symbol']}
                nestedItems={[
                  <ListItem
                    key={1}
                    secondaryText={"Description"}
                    primaryText={gene.name}
                  />,
                  <ListItem
                    key={2}
                    secondaryText={'SGD ID'}
                    primaryText={gene.sgdid}
                  />
                ]}
              />
            )
          })
        }
      </List>
    )
  }

}

export default GeneList