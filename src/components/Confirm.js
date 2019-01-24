import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class Confirm extends React.Component {
  state = {
    open: false,
    callback: null
  }

  show = callback => event => {
    event.preventDefault()

    event = {
      ...event,
      target: { ...event.target, value: event.target.value }
    }

    this.setState({
      open: true,
      callback: () => callback(event)
    })
  }

  hide = () => this.setState({ open: false, callback: null })

  confirm = () => {
    this.state.callback()
    this.hide()
  }

  render() {
    const {children, title, description, dangerous} = this.props
    const {open} = this.state
    
    return (
      <>
        {children(this.show)}
        <Dialog
          open={open}
          onClose={this.hide}
          aria-labelledby={title}
          aria-describedby={description}
        >
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{description}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.hide} color="primary" autoFocus>Not really</Button>
            <Button  variant="contained" onClick={this.confirm} color={dangerous ? 'secondary' : 'primary'}>Yes</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default Confirm;
