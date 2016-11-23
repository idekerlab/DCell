import React, {Component} from 'react'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import logo from '../../assets/images/cytoscape-logo-orange.svg'
import style from './style.css'


const DEFAULT = '../../assets/preset-styles.json'

const contentStyle = {
  width: '400px',
};


export default class ShareDialog extends Component {

  createUrl = (networkId, styleName, bg, styleSource) => {
    const fullUrl = window.location.href
    const base = fullUrl.split('/networks')[0]
    let encoded = base + '/?url=' + networkId + '&style='
      + styleName + '&bgcolor=' + bg
    if(styleSource !== undefined && styleSource !== null && styleSource !== DEFAULT) {
      encoded += '&stylesource=' + styleSource
    }
    return encoded
  }


  shouldComponentUpdate(nextProp, nextState) {
    if(nextProp.open === false && this.props.open === false) {
      return false
    } else {
      return true
    }
  }

  render() {

    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.props.onTouchTap}
      />
    ];

    // Prepare params
    const styleName = this.props.currentVs.get('vsName')
    const bg = this.props.backgroundColor.get('backgroundColor')

    const styleSource = this.props.datasource.get('styleUrl')
    const url = this.createUrl(this.props.networkId, styleName, bg, styleSource)

    return (
      <Dialog
        contentStyle={contentStyle}
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.handleClose}>

        <div className={style.grid}>

          <img className={style.logo} src={logo}/>
          <h2 className={style.title}>
            Share Visualization
          </h2>
          <TextField
            ref='urlText'
            className={style.url}
            fullWidth={true}
            floatingLabelFixed={true}
            floatingLabelStyle={{color: 'orange'}}
            floatingLabelText="Copy this url to share:"
            id="text-field-default"
            defaultValue={url}
          />

        </div>

      </Dialog>
    );
  }
}
