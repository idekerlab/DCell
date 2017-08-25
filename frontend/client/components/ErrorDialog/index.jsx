import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class ErrorDialog extends Component {


  handleClose = () => {
    this.props.openDialogAction(false, '')
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />
    ];

    return (
        <Dialog
          title="Remote Server Error"
          actions={actions}
          modal={true}
          open={this.props.openDialog}
        >
          {this.props.errorMessage}
        </Dialog>
    );
  }
}

export default ErrorDialog