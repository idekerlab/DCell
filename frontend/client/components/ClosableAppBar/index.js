import React, {Component} from 'react'

import MainMenu from '../MainMenu'
import ShareDialog from '../ShareDialog'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton';
import ShareIcon from 'material-ui/svg-icons/social/share';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

import Drawer from 'material-ui/Drawer'

const dStyle = {
  padding: 10,
}


export default class ClosableAppBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      shareDialogOpen: false
    }
  }

  openMenu = () => this.setState({open: !this.state.open});


  handleShareDialogOpen = () => {
    this.setState({shareDialogOpen: !this.state.shareDialogOpen})
    console.log('Dialog state: ' + this.state.shareDialogOpen)
  }


  render() {
    const {uiState, uiStateActions, networks, networkId,
      styles, currentVsActions, backgroundColorActions,
      backgroundColor, currentVs, datasource} = this.props

    if (!uiState.get('showAppBar')) {
      return (
        <div>
          <IconButton
            style={{zIndex: 800}}
            iconStyle={{zIndex: 900, color: '#777777'}}
            onTouchTap={this.openMenu}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            docked={false}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
            style={dStyle}
            width={400}
          >
            <MainMenu
              networks={networks}
              networkId={networkId}
              uiState={uiState}
              uiStateActions={uiStateActions}
              styles={styles}
              currentVsActions={currentVsActions}
              currentVs={currentVs}
              backgroundColor={backgroundColor}
              backgroundColorActions={backgroundColorActions}
            />
          </Drawer>
        </div>
      )
    }

    return (
      <div>
        <AppBar
          title="Merged Gene Ontology"
          onLeftIconButtonTouchTap={this.openMenu}
          iconElementRight={
            <IconButton
              onTouchTap={this.handleShareDialogOpen}
            >
              <ShareIcon />
            </IconButton>
          }
        >
        </AppBar>

        <ShareDialog
          networkId={networkId}
          onTouchTap={this.handleShareDialogOpen}
          open={this.state.shareDialogOpen}
          currentVs={currentVs}
          backgroundColor={backgroundColor}
          datasource={datasource}
        />

        <Drawer
          docked={false}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
          style={dStyle}
          width={400}
        >
          <MainMenu
            networks={networks}
            networkId={networkId}
            uiState={uiState}
            uiStateActions={uiStateActions}
            styles={styles}
            currentVsActions={currentVsActions}
            currentVs={currentVs}
            backgroundColor={backgroundColor}
            backgroundColorActions={backgroundColorActions}
          />
        </Drawer>
      </div>
    )
  }
}
