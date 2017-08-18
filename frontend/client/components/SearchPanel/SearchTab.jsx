import React, {Component} from 'react'
import {Set} from 'immutable'

import SearchIcon from 'material-ui/svg-icons/action/search';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import RaisedButton from 'material-ui/RaisedButton';

import TextField from 'material-ui/TextField';

import style from './style.css'

import GenotypePanel from './GenotypePanel'
import GeneList from './GeneList'

import SimulationTypeSelector from './SimulationTypeSelector'

const searchUiStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  paddingBottom: '0.1em',
}

const buttonStyle = {
  marginLeft: '0.5em',
  marginBottom: '0.3em',
}


const actionStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-end',
  marginTop: '0.1em',
}

const baseStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'inherit',
  height: '25em'
}


class SearchTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: '',
      noSearchYet: true,
      genes: new Set(),
      selected: {},
      runDisabled: true,
      explainDisabled: true,
      enabledButton: '',
      queryOption: 'genetic_interaction'
    }
  }

  componentWillReceiveProps(nextProps) {
    // Enable Explain button

    const genes = nextProps.queryGenes.get('genes')
    const selectedGeneCount = genes.size

    const lastGenes = this.props.queryGenes.get('genes')
    const lastCount = lastGenes.size


    if (selectedGeneCount == lastCount) {
      return
    }

    this.state.runDisabled = (selectedGeneCount < 2)

    if (this.state.runDisabled == false) {
      this.state.enabledButton = style.blinkbutton
    } else {
      this.state.enabledButton = ''
    }


  }

  shouldComponentUpdate(nextProps, nextState) {
    const searchModeNext = nextProps.searchMode

    if (searchModeNext !== 'gene') {
      return false
    } else {
      return true
    }
  }


  search = () => {

    this.setState({
      noSearchYet: false
    })

    const query = this.state.query
    const options = {
      index: 'genes',
      type: 'gene'
    }

    this.props.searchActions.searchDatabase(query, options)
  }


  clearQuery = () => {
    this.props.searchActions.clear()

    this.setState({
      query: '',
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

  setQueryOption = value => {
    console.log('QQQQQQQQQ - ' + value)
    this.setState({
      queryOption: value
    });
  }

  render() {

    const searchResult = this.props.search.result
    let hits = []
    if (searchResult !== null) {
      hits = searchResult.hits.hits
    }

    const genes = this.props.queryGenes.get('genes')

    return (
      <div style={this.props.style}>


        <SimulationTypeSelector
          queryOptionAction={this.setQueryOption}
        />

        <div style={searchUiStyle}>
          <TextField
            style={{width: '5em', flexGrow: 2}}
            hintText="Keywords, etc."
            floatingLabelText="Genotype Builder"
            floatingLabelFixed={true}

            value={this.state.query}
            onChange={this.handleChange}
            onKeyPress={this.handleKey}
          />

          <RaisedButton
            style={buttonStyle}
            icon={<ClearIcon/>}
            onClick={this.clearQuery}
          />
          <RaisedButton
            style={buttonStyle}
            icon={<SearchIcon/>}
            primary={true}
            onClick={this.search}
          />
        </div>


        {this.getListPanel(hits)}


        <GenotypePanel
          genes={genes}
          queryGenesActions={this.props.queryGenesActions}
        />

        <div style={actionStyle}>
          <RaisedButton
            label="Reset"
            labelPosition="before"
            onClick={this.resetSelection}
          />
          <RaisedButton
            label='Run'
            className={this.state.enabledButton}
            disabled={this.state.runDisabled}
            style={{marginLeft: '0.4em'}}
            labelPosition="before"
            secondary={true}
            onClick={this.runSimulation}
          />

          <RaisedButton
            label="Explain"
            style={{marginLeft: '0.4em'}}
            labelPosition="before"
            primary={true}
            disabled={this.state.explainDisabled}
            onClick={this.explainResult}
          />
        </div>
      </div>
    )

  }

  runSimulation = () => {

    console.log('Q option = ' + this.state.queryOption)
    this.props.queryGenesActions.clearResults()
    this.state.runDisabled = true
    this.state.enabledButton = ''

    // Get gene Map (immutable.js)
    const genesMap = this.props.queryGenes.get('genes')
    console.log('GENES IMM:')
    console.log(genesMap)

    const genesObj = genesMap.toJS()
    const genes = Object.keys(genesObj)

    const hits = this.props.search.result.hits.hits

    const geneMap = {}
    const geneSet = Set(genes)

    hits.forEach(hit => {

      const locusName = hit._source.locus

      if (geneSet.has(locusName)) {
        const gene = hit._source.id
        const symbol = hit._source.symbol
        const name = hit._source.name
        geneMap[locusName] = {
          name: symbol,
          id: gene,
          fullName: name
        }
      }
    })

    console.log("============= Gene Map ==============")

    console.log(genes)
    console.log(geneMap)

    let url = this.props.backendServices.simulator


    // Check optional parameters
    if(this.state.queryOption === 'growth') {
      url = url + '?growth=true'
    } else {
      url = url + '?growth=false'
    }

    console.log(url)

    this.props.queryGenesActions.runDeletion(url, genesMap, geneMap)

    this.setState({
      explainDisabled: false
    })
  }


  resetSelection = () => {
    this.props.queryGenesActions.clearGenes()
    this.props.uiStateActions.showResult(false)

    this.setState({
      explainDisabled: true
    })

    this.clearQuery()
  }

  explainResult = () => {
    this.props.uiStateActions.showResult(true)
  }


  getListPanel = hits => {

    if (this.props.search.searchType === 'terms' || (this.props.search.result === null && this.props.search.loading === false)) {

      style.background = '#EFEFEF'
      style.color = '#AAAAAA'

      return (
        <div style={baseStyle}>
          <p>No search result yet</p>
        </div>
      )
    } else if (this.props.search.loading) {
      return (
        <div style={baseStyle}>
          <div className={style.loading}></div>
          <h2 style={{color: '#888888'}}>Searching...</h2>
        </div>
      )
    }

    if (hits.length === 0) {
      return (
        <div style={baseStyle}>
          <h1 style={{color: '#555555'}}>No Match!</h1>
        </div>
      )
    }

    return (
      <GeneList
        hits={hits}
        queryGenesActions={this.props.queryGenesActions}
        queryGenes={this.props.queryGenes}
        queryOption={this.state.queryOption}
      />
    )
  }
}

export default SearchTab
