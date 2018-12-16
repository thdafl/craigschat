import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { firebaseDb, firebaseAuth } from './config/firebase.js';
import { userLogin, userLogout } from './store/users/actions';
import Home from './containers/Home';
import ChatRoom from './containers/ChatRoom';
import CreateChatRoom from './containers/CreateChatRoom'
import Header from './containers/Header'
import './App.css';

ReactGA.initialize('UA-130530759-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends Component {
  componentDidMount() {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        firebaseDb.ref('users/' + user.uid).once('value', (snapshot) => {
          if (snapshot.exists()) {
            const existingUser = snapshot.val()
            firebaseDb.ref('users/' + existingUser.id).update({ online: true })
            this.props.login(existingUser);
          } else {
            firebaseDb.ref('users/' + user.uid).set({
              "id": user.uid,
              "name" : user.displayName,
              "email" : user.email,
              "photoUrl" : user.photoURL,
              "provider": user.providerData[0].providerId,
              "online": true
            })
            firebaseDb.ref('users/' + user.uid).once('value', (snapshot) => {
              this.props.login(snapshot.val());
            })
            this.setState({ 
              user: {
                "id": user.uid,
                "name" : user.displayName,
                "email" : user.email,
                "photoUrl" : user.photoURL,
                "provider": user.providerData[0].providerId
                }
              }
            )
          }
        })
      } else {
        this.props.logout();
      }
    })
  }
  
  render() {
    return (
      <div>
        <Header user={this.props.user} />
        <Switch>
          <Route path='/' component={Home} exact={true} />
          <Route path='/chatroom/:id' component={ChatRoom} />
          <Route path="/new/chatroom" component={CreateChatRoom}/>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users.loginUser
})

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(userLogin(user)),
  logout: () => dispatch(userLogout())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
