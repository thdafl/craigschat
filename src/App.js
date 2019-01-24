import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { firebaseDb, firebaseAuth } from './config/firebase.js';
import { userLogin, userLogout } from './store/users/actions';
import Home from './containers/Home';
import ChatRoom from './containers/ChatRoom';
import EditChatRoom from './containers/EditChatRoom'
import UserProfile from './containers/UserProfile'
import EditEvent from "./containers/EditEvent.js";
import './App.css';

ReactGA.initialize('UA-130530759-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends Component {
  componentDidMount() {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        // if online, set online true
        firebaseDb.ref(".info/connected").on("value", (snap) => {
          if (snap.val() === true) {
            firebaseDb.ref('users/' + user.uid).once('value', (snapshot) => {
              if (snapshot.exists()) {
                firebaseDb.ref('users/' + user.uid).update({ online: true })
              }
            })
          }
        })

        // if disconnected, set online false
        firebaseDb.ref('users/' + user.uid + '/online').onDisconnect().remove()
      }
    })
  }
  
  render() {
    return (
      <div>
        <Switch>
          <Route path='/' component={Home} exact={true} />
          <Route path="/user/:id?" component={UserProfile}/>
          <Route path='/chatroom/:id/edit' component={EditChatRoom} />
          <Route path='/chatroom/:id' component={ChatRoom} />
          <Route path="/new/chatroom" component={EditChatRoom}/>
          <Route path="/event/:id" component={EditEvent} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.usersReducer.loginUser
})

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(userLogin(user)),
  logout: () => dispatch(userLogout())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
