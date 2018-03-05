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

    const style = {
      width: '450px',
      maxWidth: '450px',
      height: '92%',
      overflow: 'scroll',
      zIndex: 990,
      backgroundColor: 'rgb(255, 255, 255)'
    };

    const searchStyle = {
      background: 'white',
      padding: '0.5em',
    }

    return (
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
    )
  }
}

export default SearchPanel
