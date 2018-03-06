import React, {Component} from 'react'
import SearchTab from './SearchTab'

const TERM_SEARCH_MODE = 'term'
const GENE_SEARCH_MODE = 'gene'


class SearchPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchMode: GENE_SEARCH_MODE
    }
  }

  render() {

    // Check show or hide
    const uiState = this.props.uiState

    if (!uiState.get('showSearchWindow')) {
      return (<div></div>)
    }


    const wrapper = {
      overflow: 'scroll',
      width: '450px',
      minWidth: '450px',
      height: '100%',
      backgroundColor: 'rgb(255, 255, 255)'
    }

    const style = {
      zIndex: 990,
      height: '90%',
    };

    const searchStyle = {
      background: 'white',
      padding: '0.5em',
    }

    return (
      <div style={wrapper}>
        <div style={style}>
          <SearchTab
            {...this.props}
            searchMode={this.state.searchMode}
            currentNetwork={this.props.currentNetwork}
            style={searchStyle}
            search={this.props.search}
            searchActions={this.props.searchActions}
            uiStateActions={this.props.uiStateActions}
            backendServices={this.props.backendServices}
            queryGenesActions={this.props.queryGenesActions}
            queryGenes={this.props.queryGenes}
            commandActions={this.props.commandActions}
          />
        </div>
      </div>
    )
  }
}

export default SearchPanel
