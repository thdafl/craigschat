import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import { firebaseDb, firebaseAuth, googleProvider, githubProvider } from '../config/firebase.js';
import { withRouter } from 'react-router-dom';
import { userLogin, userLogout } from '../store/users/actions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      id: "",
      ownerName: "",
      description : "",
      chatRooms: []
    }

    this.onTextChange = this.onTextChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onGoToChatButtonClick = this.onGoToChatButtonClick.bind(this);
    this.googleLogin = this.googleLogin.bind(this);
  }

  componentWillMount() {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        firebaseDb.ref('users/' + user.uid).on('value', (snapshot) => {
          if (snapshot.exists()) {
            const user = snapshot.val()
            this.props.login(user);
            this.setState({ user })
          } else {
            firebaseDb.ref('users/' + user.uid).set({
              "id": user.uid,
              "name" : user.displayName,
              "email" : user.email,
              "photpUrl" : user.photoURL,
              "provider": user.providerData[0].providerId
            })
            this.props.login(user);
            this.setState({ user: {
              "id": user.uid,
              "name" : user.displayName,
              "email" : user.email,
              "photpUrl" : user.photoURL,
              "provider": user.providerData[0].providerId
              }
            })
          }
        })
      } else {
        this.props.logout();
        this.setState({ user: "" })
      }
    })

    firebaseDb.ref('chatrooms').on('child_added', (snapshot) => {
      const ctr = snapshot.val()
      const chatrooms = this.state.chatRooms

      chatrooms.push({
        id: ctr.id,
        ownerName : ctr.ownerName,
        description : ctr.description,
      })

      this.setState({
        chatRooms : chatrooms
      });
    })
  }

  onTextChange(e) {
    if(e.target.name === 'ownerName') {
      this.setState({
        ownerName : e.target.value,
      });
    } else if (e.target.name === 'description') {
      this.setState({
        description : e.target.value,
      });
    }
  }

  onButtonClick() {
    if(this.state.ownerName === "") {
      alert('Please enter your name!')
      return
    } else if(this.state.description === "") {
      alert('Please enter some description')
      return
    }

    const key = firebaseDb.ref('chatrooms').push().key;
    firebaseDb.ref('chatrooms/' + key).set({
      "id": key,
      "ownerName" : this.state.ownerName,
      "description" : this.state.description,
    })

    this.setState({key: "", ownerName: "", description: ""})
  }

  onGoToChatButtonClick(id) {
    this.props.history.push(`chatroom/${id}`);
  }

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
    console.log("#", this.state.user)
    return (
      <div className="App">
        <AppBar position="sticky" color="default">
          <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="h6" color="inherit">
                Title Placeholder
              </Typography>
              <h3 style={{paddingLeft: 10}}>{this.state.user ? `Welcome ${this.state.user.name}!` : null}</h3>
            </div>
            <div>
              {this.state.user ? null : <button onClick={this.googleLogin}>Google Login</button>}
              {this.state.user ? null : <button onClick={this.githubLogin}>Github Login</button>}
              {this.state.user ? <button onClick={this.logout}>Logout</button> : null}
            </div>
          </Toolbar>
        </AppBar>

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20}}>
          {this.state.chatRooms.map((chat, id) => {
            return (
              <Paper key={id} style={{marginBottom: '20px', paddingBottom: '15px', width: '30%'}}>
                <h4>@{chat.ownerName} - {chat.description}</h4>
                <button onClick={() => this.onGoToChatButtonClick(chat.id)}>Join this Chatroom</button>
              </Paper>
            )
          })}
        </div>

         <div style={{marginBottom: '20px'}}>
          <input
            name='ownerName'
            placeholder="Chatroom Owner Name"
            value={this.state.ownerName}
            onChange={this.onTextChange}
          />
        <textarea
            name='description'
            placeholder="Description"
            value={this.state.description}
            onChange={this.onTextChange}
          />
          <button onClick={this.onButtonClick}>Add ChatRoom</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users
})

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(userLogin(user)),
  logout: () => dispatch(userLogout())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));