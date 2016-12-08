import React, {Component} from 'react'


import * as colors from 'material-ui/styles/colors';

import {List, ListItem} from 'material-ui/List';

import SearchIcon from 'material-ui/svg-icons/action/search';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import RaisedButton from 'material-ui/RaisedButton';
import RunIcon from 'material-ui/svg-icons/av/play-arrow';


import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

import TextField from 'material-ui/TextField';


class SearchTab extends Component {

  render() {

    const searchUiStyle = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      paddingBottom: '0.5em'
    }

    const itemStyle = {
      marginLeft: '0.5em',
      marginBottom: '0.5em',
    }

    const listStyle ={
      overflow: 'scroll',
      height: '20em',
      background: 'white'
    }

    const actionStyle = {
      display: 'flex',
      background: colors.blueGrey50,
      marginTop: '0.5em'
    }

    return (
      <div style={this.props.style}>
        <div style={searchUiStyle}>
          <TextField
            style={{flexGrow: 2}}
            hintText="Enter search keywords here..."
            floatingLabelText="Keyword Search"
            floatingLabelFixed={true}

          />

          <RaisedButton
            style={itemStyle}
            icon={<ClearIcon />}
          />
          <RaisedButton
            style={itemStyle}
            icon={<SearchIcon />}
            primary={true}
          />
        </div>


        <List style={listStyle}>
          <Subheader>Search Result</Subheader>
          <ListItem
            leftCheckbox={<Checkbox />}
            primaryText="PDR11"
            secondaryText="ATP-binding cassette (ABC) transporter"
          />
          <ListItem
            leftCheckbox={<Checkbox />}
            primaryText="BUD21"
            secondaryText="Component of small ribosomal subunit (SSU) processosome"
          />
        </List>

        <div style={actionStyle}>
          <RaisedButton
            style={{flexGrow: 1}}
            label="Clear Selection"
            labelPosition="before"
            icon={<ClearIcon />}
          />
          <RaisedButton
            style={{flexGrow: 1}}
            label="Run Simulation"
            labelPosition="before"
            icon={<RunIcon />}
            secondary={true}
          />

        </div>
      </div>
    )

  }
}

export default SearchTab
