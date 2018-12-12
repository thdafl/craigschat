import React, { Component } from 'react'
import { connect } from 'react-redux';

import { firebaseDb, firebaseAuth } from '../config/firebase.js';
import { userLogin, userLogout } from '../store/users/actions';

class CreateChatRoom extends Component {
  state = {
    description: ''
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
        timestamp : m.timestamp
      })

      this.setState({
        messages : msgs
      });
    })
  }

  onTextChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onButtonClick = () => {
    if (this.state.description === "") {
      alert('Please enter some description')
      return
    }

    const {key} = firebaseDb.ref('chatrooms').push();

    console.log({
      "id": key,
      "owner" : this.props.user.loginUser,
      "description" : this.state.description,
    })
    
    firebaseDb.ref('chatrooms/' + key).set({
      "id": key,
      "owner" : this.props.user.loginUser,
      "description" : this.state.description,
    }).then(() => {
      this.props.history.push(`/chatroom/${key}`)
    })

    this.setState({key: "", ownerName: "", description: ""})
  }
  
  render() {
    return (
      <div>
        <textarea
          name='description'
          placeholder="Description"
          value={this.state.description}
          onChange={this.onTextChange}
        />
        <button onClick={this.onButtonClick}>Add ChatRoom</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.users
})

const mapDispatchToProps = (dispatch) => ({
  login: (user) => dispatch(userLogin(user)),
  logout: () => dispatch(userLogout())
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateChatRoom)
