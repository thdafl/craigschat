import React, { Component } from 'react';
import { firebaseDb, firebaseAuth } from '../config/firebase.js';
import { userLogin, userLogout } from '../store/users/actions';
import TextField from '@material-ui/core/TextField';
import Header from './Header';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text : "",
      messages : []
    }

    this.onTextChange = this.onTextChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentWillMount() {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        firebaseDb.ref('users/' + user.uid).on('value', (snapshot) => {
          if (snapshot.exists()) {
            const user = snapshot.val()
            this.props.login(user);
          } else {
            this.props.logout();
          }
        })
      }
    })

    const chatRoomId = this.props.match.params.id;
    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/').on('child_added', (snapshot) => {
      const m = snapshot.val()
      let msgs = this.state.messages

      msgs.push({
        id: m.id,
        text : m.text,
        userName : m.userName,
      })

      this.setState({
        messages : msgs
      });
    })
  }

  onTextChange(e) {
    this.setState({
      text : e.target.value,
    });
  }

  onButtonClick(e) {
    e.preventDefault();
    const chatRoomId = this.props.match.params.id;

    if (this.state.text === "") {
      alert('Please add comment!')
      return
    }

    const key = firebaseDb.ref('chatrooms/').push().key;
    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/' + key).set({
      "id": key,
      "userName" : (this.props.user) ? this.props.user.name : "Guest",
      "text" : this.state.text,
    })

    this.setState({userName: "", text: ""})
  }

  render() {
    console.log("@@@", this.props.user)
    return (
      <div className="App" style={{paddingTop: 100}}>
        <Header user={this.props.user} />
        <div className="MessageList">
          {this.state.messages.map((m, i) => <h2 key={i}>@{m.userName} {m.text}</h2>)}
        </div>

        <form onSubmit={this.onButtonClick}>
          <TextField
            id="comment-box"
            margin="normal"
            variant="outlined"
            onChange={this.onTextChange}
            value={this.state.text}
          />
        </form>
        <Link to="/">Back to Home</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);