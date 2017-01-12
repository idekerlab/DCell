import React, {Component} from 'react'
import Immutable, {Set} from 'immutable'

import * as colors from 'material-ui/styles/colors';

import {List, ListItem} from 'material-ui/List';

import SearchIcon from 'material-ui/svg-icons/action/search';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import RaisedButton from 'material-ui/RaisedButton';


import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

import TextField from 'material-ui/TextField';

import style from './style.css'

import GenotypePanel from './GenotypePanel'

import {TransitionMotion, spring, presets} from 'react-motion'

import Avatar from 'material-ui/Avatar';


const GO_NAMESPACE = {
  'biological_process': {
    tag: 'BP',
    color: colors.cyan300
  },
  'cellular_component': {
    tag: 'CC',
    color: colors.lightGreen300
  },
  'molecular_function': {
    tag: 'MF',
    color: colors.orange300
  },

}


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

        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^WILL called")
        this.selectTerms(hits)
      }
    }
  }


  search = () => {

    // Search terms, not genes
    const options = {
      index: 'terms',
      type: 'go_term'
    }

    this.setState({
      loading: true,
      noSearchYet: false
    })

    const query = this.state.query
    console.log("Q2 = " + query)
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

  handleKey = event => {
    if (event.key === 'Enter') {
      this.search()
    }
  }

  handleItemClick = termId => {

    console.log('Click item!')
    console.log(termId)

    this.props.commandActions.focus({idList: [termId]})
  }


  selectTerms = hits => {
    const searchResult = this.props.search.result
    const selectedTerms = hits.map(hit => (hit._id))

    if(searchResult === undefined || searchResult === null) {
      console.log('***************************************************************************************** first SELECT')
      this.props.commandActions.select({idList: selectedTerms})
      return
    } else {
      console.log('***************************************************************************************** 2+ SELECT')

    }


    // if(!Immutable.is(currentSet, newSet)) {
    //   console.log('***************************************************************************************** 33SELECT')
    //   console.log(newSet)
    //   console.log(currentSet)
    //   // this.props.commandActions.select({idList: selectedTerms})
    // } else {
    //   console.log('***************************************************************************************** NO SELECT')
    // }

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


    const actionStyle = {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
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
            style={{width: '5em', flexGrow: 2}}
            hintText="Keywords, etc."
            floatingLabelText="Term Search"
            floatingLabelFixed={true}

            value={this.state.query}
            onChange={this.handleChange}
            onKeyPress={this.handleKey}
          />

          <RaisedButton
            style={buttonStyle}
            icon={<ClearIcon />}
            onClick={this.clearQuery}
          />
          <RaisedButton
            style={buttonStyle}
            icon={<SearchIcon />}
            primary={true}
            onClick={this.search}
          />
        </div>


        {this.getListPanel(hits)}

      </div>
    )

  }


  itemSelected = symbol => {
    const genes = this.state.genes

    if(genes.has(symbol)) {
      console.log("deleting")
      genes.delete(symbol)
    } else {
      console.log("adding " + symbol)
      genes.add(symbol)
    }
    console.log('Selected: ' + symbol)
    console.log(genes)
    this.setState({genes: genes})
    console.log(this.state.genes)
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

          const termId = hit._id

          return (
            <ListItem
              key={i}
              primaryText={hit._source.name}
              secondaryText={termId}
              leftAvatar={
                <Avatar
                  color={colors.white}
                  backgroundColor={GO_NAMESPACE[hit._source.namespace].color}
                >
                  {GO_NAMESPACE[hit._source.namespace].tag}
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
