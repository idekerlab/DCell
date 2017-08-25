import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class ErrorDialog extends Component {


  handleClose = () => {
    this.props.openDialogAction(false)
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
          title="Error: Server is busy"
          actions={actions}
          modal={true}
          open={this.props.openDialog}
        >
          Simulator server is running other jobs.  Please try again later.
        </Dialog>
    );
  }
}

export default ErrorDialog