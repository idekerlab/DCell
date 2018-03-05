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
            style={{marginLeft: '0.6em'}}
          />
        </a>

        <ToolbarTitle
          text="DCell v1.4"
          style={{marginLeft: '0.4em'}}
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