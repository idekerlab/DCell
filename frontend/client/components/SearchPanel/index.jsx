import React, {Component} from 'react'
import * as colors from 'material-ui/styles/colors';
import {Tabs, Tab} from 'material-ui/Tabs';
import SearchIcon from 'material-ui/svg-icons/action/search';
import ListIcon from 'material-ui/svg-icons/action/list';

import SearchTab from './search'
import ListTab from './ListTab'


class SearchPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: 'search',
    };
  }

  handleChange = value => {
    this.setState({
      selected: value,
    });
  }

  render() {
    const style = {
      width: '20%',
      background: 'rgba(100, 100, 100, 0.1)',
      position: 'fixed',
      left: '0.3em',
      top: '6em',
      padding: '0.5em',
      zIndex: 999
    };

    const tabStyle = {
      background: colors.blueGrey500,
      height: '100%',
    }

    const searchStyle = {
      background: 'white',
      padding: '0.5em'
    }

    return (
      <div style={style}>
        <Tabs
          style={tabStyle}
          value={this.state.selected}
          onChange={this.handleChange}
        >
          <Tab
            icon={<SearchIcon/>}
            value="search"
          >
            <SearchTab
              style={searchStyle}
              search={this.props.search}
              searchActions={this.props.searchActions}
            />
          </Tab>
          <Tab
            icon={<ListIcon/>}
            value="list"
          >
            <ListTab />
          </Tab>
        </Tabs>
      </div>
    )

  }
}

export default SearchPanel
