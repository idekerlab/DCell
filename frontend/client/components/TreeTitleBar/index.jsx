import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import HomeIcon from 'material-ui/svg-icons/action/home';
import React from 'react'
import FlatButton from 'material-ui/FlatButton';


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

  const firstStyle = {
    display: 'inline-flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }

  const buttonStyle = {
    margin: 0
  }

  const labelStyle = {
    color: '#666666',
    fontWeight: 200,
    fontSize: '1.2em',
    textTransform: 'none'
  }

  return (
    <Toolbar>
      <ToolbarGroup firstChild={true} >

        <FlatButton
          icon={<HomeIcon />}
          href={'http://deep-cell.ucsd.edu/'}
          style={buttonStyle}
          label={'DCell 1.4'}
          labelStyle={labelStyle}
          hoverColor={'rgba(0,0,0,0)'}
          disableTouchRipple={true}

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