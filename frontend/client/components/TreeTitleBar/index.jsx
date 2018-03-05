import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import HomeIcon from 'material-ui/svg-icons/action/home';
import React, {Component} from 'react'

const TreeTitlebar = (props) => {

  const genes = props.genes.toJS()

  console.log(genes)

  let message = ''

  const searchResult = props.result
  if (searchResult !== null) {
    const geneNames = Object.values(genes)
    const geneStr = geneNames.join(', ')
    message = 'Explanation of growth phenotype for ' + geneStr
  }

  return (
    <Toolbar>
      <ToolbarGroup firstChild={true}>

        <a href={'http://deep-cell.ucsd.edu/'}>
          <HomeIcon
            style={{marginLeft: '0.8em'}}
          />
        </a>

        <ToolbarTitle
          text="DCell: A neural network to simulate cell structure and function"
          style={{marginLeft: '0.3em'}}
        />
      </ToolbarGroup>
      <ToolbarGroup>
        <ToolbarTitle text={message}/>
        <ToolbarSeparator/>
      </ToolbarGroup>
    </Toolbar>
  )
}

export default TreeTitlebar