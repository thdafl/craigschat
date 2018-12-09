import React, { Component } from 'react';
import { firebaseAuth, googleProvider, githubProvider } from '../config/firebase.js';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class Header extends Component {
  googleLogin() {
    firebaseAuth.signInWithRedirect(googleProvider);
  }

  githubLogin() {
    firebaseAuth.signInWithRedirect(githubProvider);
  }

  logout() {
    firebaseAuth.signOut()
  }

  render() {
    return (
      <AppBar position="fixed" color="default">
      <Toolbar style={{display: 'flex', justifyContent: 'space-between', paddingLeft: '5rem', paddingRight: '5rem'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <Typography variant="h6" color="inherit">
            Title Placeholder
          </Typography>
          <h3 style={{paddingLeft: 10}}>{this.props.user ? `Welcome ${this.props.user.name}!` : null}</h3>
        </div>
        <div>
          {this.props.user ? null : <button onClick={this.googleLogin}>Google Login</button>}
          {this.props.user ? null : <button onClick={this.githubLogin}>Github Login</button>}
          {this.props.user ? <button onClick={this.logout}>Logout</button> : null}
        </div>
      </Toolbar>
    </AppBar>
    )
  }
}

export default Header;