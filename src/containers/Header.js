import React, { Component } from 'react';
import { firebaseDb, firebaseAuth, googleProvider, githubProvider } from '../config/firebase.js';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withRouter, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Avatar, Fab, Button, Menu, MenuItem } from '@material-ui/core';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { anchorEl: null }

    this.logout = this.logout.bind(this);
    this.onClickMenuOpen = this.onClickMenuOpen.bind(this);
    this.onClickMenuClose = this.onClickMenuClose.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
  }

  googleLogin() {
    firebaseAuth.signInWithRedirect(googleProvider);
    // need to show an error message when fails
  }

  githubLogin() {
    firebaseAuth.signInWithRedirect(githubProvider);
    // need to show an error message when fails
  }

  logout() {
    firebaseDb.ref('users/' + this.props.user.id).update({ online: false })
    firebaseAuth.signOut();
    this.props.history.push('/');
  }

  onClickMenuOpen(event) {
    this.setState({anchorEl: event.currentTarget})
  }

  onClickMenuClose() {
    this.setState({anchorEl: null})
  }

  renderButtons() {
    if (!this.props.user) {
      return (
        <div>
          <Button
            variant="outlined"
            aria-owns={this.state.menuOpen ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.onClickMenuOpen}
            size="small"
            disableRipple
            style={{background: 'linear-gradient(135deg, rgba(38, 65, 143, 1) 0%, rgba(92, 107, 192, 1) 100%)', color: 'white', fontWeight: 600}}
          >
            Sign In/Up
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            open={Boolean(this.state.anchorEl)}
            onClose={this.onClickMenuClose}
          >
            <MenuItem onClick={this.googleLogin}>Signin/Login with Google</MenuItem>
            <MenuItem onClick={this.githubLogin}>Signin/Login with Github</MenuItem>
          </Menu>
        </div>
      )
    } else {
      return (
        <div>
          <Link to="/new/chatroom" style={{textDecoration: 'none'}}>
            <Button
              variant="contained"
              size="small"
              disableRipple
              color="secondary"
              style={{marginRight: 10, fontWeight: 600}}
            >
              Create a Room
            </Button>
          </Link>
          <Button
            variant="outlined"
            aria-owns={this.state.menuOpen ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={this.logout}
            size="small"
            disableRipple
            style={{marginRight: 20, background: 'linear-gradient(135deg, rgba(38, 65, 143, 1) 0%, rgba(92, 107, 192, 1) 100%)', color: 'white', fontWeight: 600}}
          >
            Logout
          </Button>
          <Link to="/user">
            <Fab size='small' disableRipple>
              <Avatar 
                alt="user avatar"
                src={this.props.user.photoUrl}
              />
            </Fab>
          </Link>
        </div>
      )
    }
  }

  render() {
    return (
      <AppBar position="absolute" color="default" style={{boxShadow: 'none', backgroundColor: 'rgb(38, 65, 143)'}}>
        <Toolbar style={{display: 'flex', justifyContent: 'space-between', alignSelf: 'center'}} className={this.props.classes.toolbar}>
          <div style={{display: 'flex', alignItems: 'center', fontSize: '25px'}}>
            <span role="img" aria-label="logo">🤘</span>
          </div>

          <div style={{display: 'flex'}}>
            {this.renderButtons()}
          </div>
        </Toolbar>
      </AppBar>
    )
  }
}

const styles = theme => ({
  toolbar: {
    padding: 0,
    [theme.breakpoints.up('lg')]: {
      width: "80%"
    },
    [theme.breakpoints.up('xl')]: {
      width: "75%"
    }
  }
});

export default withRouter(withStyles(styles)(Header));
