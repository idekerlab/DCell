import React from 'react'
import SearchTab from './SearchTab'

const GENE_SEARCH_MODE = 'gene'

const SearchPanel = props => (
  <SearchTab
    {...props}
    searchMode={GENE_SEARCH_MODE}
    currentNetwork={props.currentNetwork}
    search={props.search}
    searchActions={props.searchActions}
    uiStateActions={props.uiStateActions}
    backendServices={props.backendServices}
    queryGenesActions={props.queryGenesActions}
    queryGenes={props.queryGenes}
    commandActions={props.commandActions}
  />
)

export default SearchPanel
