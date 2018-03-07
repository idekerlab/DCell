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
import ExampleQueries from './ExampleQueries'

import Divider from 'material-ui/Divider';


// TODO: This is a hack
import geneList from './gene-list'

const geneSet = new Set(geneList)


const searchUiStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingBottom: '0.1em',
  height: '7em'

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
  paddingBottom: '0.5em'
}

const baseStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'inherit',
  height: '25em'
}

const EXAMPLE = [
  ["YDR004W", "RAD57"],["YIL139C", "REV7"]
]


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
      queryOption: 'growth',
      disableQueryOption: false
    }
  }

  componentWillReceiveProps(nextProps) {
    // Enable Explain button

    const genes = nextProps.queryGenes.get('genes')
    const selectedGeneCount = genes.size

    const lastGenes = this.props.queryGenes.get('genes')
    const lastCount = lastGenes.size

    // Ontology mode: if CLIXO, only GI works for now.
    const ontologyType = this.props.currentNetwork.id
    if(ontologyType === 'clixo') {
      this.setState({
        disableQueryOption: true
      })


      this.setQueryOption('genetic_interaction')
    }

    const runLast = this.props.queryGenes.get('running')
    const run = nextProps.queryGenes.get('running')

    if(runLast === true && run === false) {
      this.setState({
        runDisabled: false
      })
    }


    if (selectedGeneCount === lastCount) {
      return
    }

    if(selectedGeneCount >= 1 && this.state.queryOption === 'growth') {
      this.setState({
        runDisabled: false,
        enabledButton: style.blinkbutton
      })
    } else if(selectedGeneCount < 2) {
      this.setState({
        runDisabled: true,
        enabledButton: ''
      })
    } else {
      this.setState({
        runDisabled: false,
        enabledButton: style.blinkbutton
      })
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

  search = (event, q) => {

    let query = this.state.query
    if(q !== undefined) {
      query = q
    }

    this.setState({
      noSearchYet: false
    })

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

  setQuery = (query) => {
    this.setState({
      query: query
    });
    this.search(null, query)
  }

  handleKey = event => {
    if (event.key === 'Enter') {
      this.search()
    }
  }

  setQueryOption = value => {
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


    console.log()

    const genes = this.props.queryGenes.get('genes')


    const wrapper = {
      zIndex: 990,
      overflow: 'scroll',
      width: '450px',
      minWidth: '450px',
      padding: '0.5em',
      display: 'inline-flex',
      flexDirection: 'column',
      background: '#FFFFFF'
    }

    return (
      <div style={wrapper}>

        <div style={searchUiStyle}>
          <TextField
            style={{width: '5em', flexGrow: 2}}
            hintText="e.g. dna repair, rad57"
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

        <Divider/>

        <GenotypePanel
          genes={genes}
          queryGenesActions={this.props.queryGenesActions}
        />


        <div style={actionStyle}>
          <RaisedButton
            label="Example"
            labelPosition="before"
            primary={true}
            onClick={this.runExample}
          />

          <RaisedButton
            label="Reset"
            labelPosition="before"
            style={{marginLeft: '0.4em'}}
            onClick={this.resetSelection}
          />
          <RaisedButton
            label='Simulate'
            className={this.state.enabledButton}
            disabled={this.state.runDisabled}
            style={{marginLeft: '0.4em'}}
            labelPosition="before"
            secondary={true}
            onClick={this.runSimulation}
          />
        </div>
      </div>
    )

  }

  runExample = () => {
    this.resetSelection()
    this.setQueryOption('growth')
    this.setQuery('CYT1 COX7')
  }

  runSimulation = () => {


    // Clear
    this.props.queryGenesActions.clearResults()
    this.state.runDisabled = true
    this.state.enabledButton = ''

    // Get gene Map (immutable.js)
    const genesMap = this.props.queryGenes.get('genes')
    console.log('GENES IMM:')
    console.log(genesMap)

    let genesObj = genesMap.toJS()


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


    let url = this.props.backendServices.simulator


    // Check optional parameters
    if(this.state.queryOption === 'growth') {
      url = url + '?growth=true'
    } else {
      url = url + '?growth=false'
    }

    const ontologyType = this.props.currentNetwork.id

    url = url + '&ontology=' + ontologyType.toUpperCase()

    console.log(url)

    this.props.queryGenesActions.runDeletion(url, this.state.queryOption, genesMap, geneMap)

    // Reset the selection
    this.props.commandActions.unselectAll()

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

    const filtered = hits.filter((value, index) => {
      const locusName = value._source.locus

      if(geneSet.has(locusName)) {
        return true
      } else {
        return false
      }
    })
    console.log(filtered)

    return (
      <GeneList
        hits={filtered}
        queryGenesActions={this.props.queryGenesActions}
        queryGenes={this.props.queryGenes}
        queryOption={this.state.queryOption}
      />
    )
  }
}

export default SearchTab
