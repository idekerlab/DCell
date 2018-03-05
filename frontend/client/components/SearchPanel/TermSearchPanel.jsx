import React, {Component} from 'react'
import {Set} from 'immutable'

import * as colors from 'material-ui/styles/colors';

import {List, ListItem} from 'material-ui/List';

import Subheader from 'material-ui/Subheader';


import SearchIcon from 'material-ui/svg-icons/action/search';

import ClearIcon from 'material-ui/svg-icons/content/clear';
import RaisedButton from 'material-ui/RaisedButton';

import TextField from 'material-ui/TextField';

import style from './style.css'

import StructureSelectorPanel from './StructureSelectorPanel'
import ExampleTermSearch from './ExampleTermSearch'

import Avatar from 'material-ui/Avatar';





class TermSearchPanel extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: '',
      loading: false,
      noSearchYet: true,
      idSet: Set()
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.search.result !== null) {
      this.setState({loading: false})
      const searchResult = nextProps.search.result
      let hits = []
      if(searchResult !== null) {
        hits = searchResult.hits.hits

        this.selectTerms(hits)
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const searchMode = nextProps.searchMode
    if(searchMode !== 'term') {
      return false;
    }

    return true
  }

  search = (event, q) => {

    let query = this.state.query
    if(q !== undefined) {
      query = q
    }

    const options = this.props.trees[this.props.currentNetwork.id].searchOptions

    this.setState({
      loading: true,
      noSearchYet: false
    })


    // Special case: exact match for CLIXO
    if(query !== undefined && query !== null && query != '') {
      const parts = query.split(':')
      const prefix = parts[0].toUpperCase()
      if(prefix === 'CLIXO') {
        query = parts[1]
      }
    }

    this.props.searchActions.searchDatabase(query, options)
  }


  clearQuery = () => {
    this.setState({
      query: '',
      loading: false,
      noSearchYet: true
    });

    this.props.searchActions.clear()
  }

  handleChange = event => {
    this.setState({
      query: event.target.value
    });
  }

  setQuery = query => {
    this.setState({
      query: query
    });
  }

  handleKey = event => {
    if (event.key === 'Enter') {
      this.search()
    }
  }

  handleItemClick = termId => {
    this.props.commandActions.focus({idList: [termId]})
  }


  selectTerms = hits => {
    const searchResult = this.props.search.result
    const selectedTerms = hits.map(hit => (hit._id))

    if(searchResult === undefined || searchResult === null) {
      console.log('***************************************************************************************** first SELECT')
      // this.props.commandActions.select({idList: selectedTerms})
      return
    } else {
      console.log('***************************************************************************************** 2+ SELECT')

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

    const buttonStyle = {
      marginLeft: '0.5em',
      marginBottom: '0.5em',
    }

    const searchResult = this.props.search.result
    let hits = []
    if(searchResult !== null) {
      hits = searchResult.hits.hits
    }

    return (
      <div style={this.props.style}>

        <StructureSelectorPanel
          trees={this.props.trees}
          currentNetwork={this.props.currentNetwork}
          currentNetworkActions={this.props.currentNetworkActions}
          propertyActions={this.props.propertyActions}
        />

      </div>
    )

  }

  getListPanel = hits => {
    const listStyle ={
      overflow: 'scroll',
      height: '30em',
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


    const isLoading = this.props.search.loading

    if(this.state.noSearchYet && isLoading === false) {
      style.background = '#EFEFEF'
      style.color = '#AAAAAA'

      return(
        <div style={baseStyle}>
          <p>No search result yet</p>
        </div>
      )
    } else if(isLoading) {
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

    const curNetId = this.props.currentNetwork.id
    const curTree = this.props.trees[curNetId]

    const namespace = curTree.properties.namespace


    let nsColor = 'teal'
    let nsTag = 'CX'

    return (
      <List style={listStyle}>
      <Subheader>Search Result</Subheader>

      {
        hits.map((hit, i) => {


          const termId = hit._id

          const ns = hit._source.namespace
          if (curNetId === 'go' && namespace[ns] !== undefined) {
            nsColor = namespace[ns].color
            nsTag = namespace[ns].tag
          }

          return (
            <ListItem
              key={i}
              primaryText={hit._source.name}
              secondaryText={termId}
              leftAvatar={
                <Avatar
                  color={colors.white}
                  backgroundColor={nsColor}
                >
                  {nsTag}
                </Avatar>
              }
              onClick={ () => {
                this.handleItemClick(termId)
              }}
            />
          )
        })
      }
    </List>)

  }

}


export default TermSearchPanel
