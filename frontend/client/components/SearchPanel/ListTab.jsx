import React, {Component} from 'react'


import * as colors from 'material-ui/styles/colors';

import {List, ListItem} from 'material-ui/List';

import {Tabs, Tab} from 'material-ui/Tabs';
import SearchIcon from 'material-ui/svg-icons/action/search';
import ListIcon from 'material-ui/svg-icons/action/list';


class ListTab extends Component {

  render() {
    const style = {
      height: '100%',
      background: 'white',

      color: 'red',
      padding: '0.5em',
    };

    return (
      <div style={style}>
        <h1>List Panel</h1>
      </div>
    )

  }
}

export default ListTab

