import React, { Component } from 'react'
import { connect } from 'react-redux';

import { firebaseDb } from '../config/firebase.js';

class CreateChatRoom extends Component {
  state = {
    description: ''
  }

  componentDidMount() {
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
    firebaseDb.ref('chatrooms/' + key).set({
      "id": key,
      "owner" : this.props.user.loginUser,
      "description" : this.state.description,
    }).then(() => {
      firebaseDb.ref('chatrooms/' + key + '/roommembers/' + this.props.user.loginUser.id).set(this.props.user.loginUser)
      this.props.history.push(`/chatroom/${key}`)
    })

    this.setState({key: "", ownerName: "", description: ""})
  }
  
  render() {
    return (
      <div style={{height: 200, width: 200}}>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateChatRoom)
