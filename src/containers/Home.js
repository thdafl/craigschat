import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../App.css';
import { firebaseDb, firebaseAuth } from '../config/firebase.js';
import { withRouter } from 'react-router-dom';
import { userLogin, userLogout } from '../store/users/actions';
import Header from './Header';
import Paper from '@material-ui/core/Paper';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      id: "",
      description : "",
      chatRooms: []
    }

    this.onTextChange = this.onTextChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onGoToChatButtonClick = this.onGoToChatButtonClick.bind(this);
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
            this.setState({ 
              user: {
                "id": user.uid,
                "name" : user.displayName,
                "email" : user.email,
                "photpUrl" : user.photoURL,
                "provider": user.providerData[0].providerId
                }
              }
            )
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
    if (e.target.name === 'description') {
      this.setState({
        description : e.target.value,
      });
    }
  }

  onButtonClick() {
    if (this.state.description === "") {
      alert('Please enter some description')
      return
    }

    const key = firebaseDb.ref('chatrooms').push().key;
    firebaseDb.ref('chatrooms/' + key).set({
      "id": key,
      "ownerName" : this.props.user.loginUser.name,
      "description" : this.state.description,
    })

    this.setState({key: "", ownerName: "", description: ""})
  }

  onGoToChatButtonClick(id) {
    this.props.history.push(`chatroom/${id}`);
  }

  render() {
    console.log("#", this.props.user)
    return (
      <div className="App">
        <Header 
          user={this.state.user}
        />

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 100}}>
          {this.state.chatRooms.map((chat, id) => {
            return (
              <Paper key={id} style={{marginBottom: '20px', paddingBottom: '15px', width: '30%'}}>
                <h4>@{chat.ownerName} - {chat.description}</h4>
                <button onClick={() => this.onGoToChatButtonClick(chat.id)}>Join this Chatroom</button>
              </Paper>
            )
          })}
        </div>

        {(this.props.user.loginUser) ? <div style={{marginBottom: '20px'}}>
          <textarea
              name='description'
              placeholder="Description"
              value={this.state.description}
              onChange={this.onTextChange}
            />
            <button onClick={this.onButtonClick}>Add ChatRoom</button>
        </div> : null}
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