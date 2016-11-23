import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {browserHistory} from 'react-router'
import * as networkSourceActions from '../../reducers/currentnetwork'
import * as currentVsActions from '../../reducers/currentvs'
import * as backgroundColorActions from '../../actions/background-color'
import * as vsActions from '../../reducers/visualstyles'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import TopPage from '../../components/TopPage'

import style from './style.css'
import presets from '../../assets/preset-styles.json'

const PRESET_STYLES_LOCATION = '../../assets/preset-styles.json'
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();


class Entrance extends Component {

  componentWillMount() {
    // Extract query params
    const queryParams = this.props.location.query
    const networkId = queryParams.url
    const styleName = queryParams.style
    const backgroundColor = queryParams.bgcolor
    let stylesource= queryParams.stylesource

    if (networkId !== undefined) {

      if(backgroundColor !== undefined) {
        this.props.backgroundColorActions.setBackgroundColor(backgroundColor)
      }

      if(stylesource === undefined) {
        stylesource = PRESET_STYLES_LOCATION
        this.loadStyles()
      } else {
        // First, load style
        this.props.vsActions.fetchVisualStyles(stylesource)
      }

      // Prepare params
      if(styleName !== undefined) {
        this.props.currentVsActions.setCurrentVs(styleName)
      }

      // Redirect to network page
      const encodedId = encodeURIComponent(networkId)
      browserHistory.push('/networks/' + encodedId)
    } else {
      // Load preset styles
      this.loadStyles()
    }
  }

  loadStyles() {
    const styleMap = {}
    presets.map(vs => {
      styleMap[vs.title] = vs.style
    })
    this.props.vsActions.addStyles(styleMap)
  }

  render() {
    const {currentNetwork, networkSourceActions, datasourceActions, datasource} = this.props

    return (
      <MuiThemeProvider>
        <TopPage
          className={style.main}
          currentNetwork={currentNetwork}
          networkSourceActions={networkSourceActions}
          datasourceActions={datasourceActions}
          datasource={datasource}
        />
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    currentNetwork: state.app_manager.current_network,
    datasource: state.app_manager.datasource,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    networkSourceActions: bindActionCreators(networkSourceActions, dispatch),
    currentVsActions: bindActionCreators(currentVsActions, dispatch),
    backgroundColorActions: bindActionCreators(backgroundColorActions, dispatch),
    vsActions: bindActionCreators(vsActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Entrance)