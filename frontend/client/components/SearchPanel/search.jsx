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

import style from './style.css'

import {TransitionMotion, spring, presets} from 'react-motion'




class SearchTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: '',
      loading: false,
      noSearchYet: true
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("!!! got prop in search:")
    console.log(nextProps)

    if(nextProps.search.result !== null) {
      this.setState({loading: false})
    }
  }


  search = () => {

    this.setState({
      loading: true,
      noSearchYet: false
    })

    const query = this.state.query
    console.log("Q = " + query)
    this.props.searchActions.searchDatabase(query)
  }


  clearQuery = () => {
    this.setState({
      query: '',
      loading: false,
      noSearchYet: true
    });
  }

  handleChange = event => {
    this.setState({
      query: event.target.value
    });
  }

  handleKey = event => {
    if (event.key === 'Enter') {
      this.search()
    }
  }

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


    const actionStyle = {
      display: 'flex',
      background: colors.blueGrey50,
      marginTop: '0.5em'
    }



    const searchResult = this.props.search.result
    let hits = []
    if(searchResult !== null) {
      hits = searchResult.hits.hits
    }


    return (
      <div style={this.props.style}>
        <div style={searchUiStyle}>
          <TextField
            style={{flexGrow: 2}}
            hintText="Enter search keywords here..."
            floatingLabelText="Keyword Search"
            floatingLabelFixed={true}

            value={this.state.query}
            onChange={this.handleChange}
            onKeyPress={this.handleKey}
          />

          <RaisedButton
            style={itemStyle}
            icon={<ClearIcon />}
            onClick={this.clearQuery}
          />
          <RaisedButton
            style={itemStyle}
            icon={<SearchIcon />}
            primary={true}
            onClick={this.search}
          />
        </div>


        {this.getListPanel(hits)}


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


  getListPanel = hits => {
    const listStyle ={
      overflow: 'scroll',
      height: '20em',
      background: 'white'
    }

    const baseStyle = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '20em',
      background: 'white'
    }

    if(this.state.noSearchYet && this.state.loading === false) {
      style.background = '#EFEFEF'
      style.color = '#AAAAAA'

      return(
        <div style={baseStyle}>
          <p>No search result yet</p>
        </div>
      )
    } else if(this.state.loading) {
      return (
        <div style={baseStyle}>
          <div className={style.loading}></div>
          <h2 style={{color: '#888888'}}>Searching...</h2>
        </div>
      )
    }

    if(hits.length === 0) {
      return (
        <div style={baseStyle}>
          <h1 style={{color: '#555555'}}>No Match!</h1>
        </div>
      )
    }

    return (<List style={listStyle}>
      <Subheader>Search Result</Subheader>

      {
        hits.map((hit, i) => {

          const symbol = hit._source.symbol
          const locusName = hit._source.locus

          return (
            <ListItem
              key={i}
              leftCheckbox={<Checkbox />}
              primaryText={symbol + '  (' + locusName + ')'}
              secondaryText={hit._source.name}
            />
          )
        })
      }
    </List>)

  }
}


export default SearchTab
