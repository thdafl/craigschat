import React, { Component } from 'react';
import { firebaseDb } from '../config/firebase.js'
import { CommentBox } from '../components/CommentBox';
import { Link } from 'react-router-dom';

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      text : "",
      messages : []
    }

    this.onTextChange = this.onTextChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentWillMount() {
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
    if(e.target.name === 'userName') {
      this.setState({
        userName : e.target.value,
      });
    } else if (e.target.name === 'text') {
      this.setState({
        text : e.target.value,
      });
    }
  }

  onButtonClick() {
    const chatRoomId = this.props.match.params.id;

    if(this.state.userName === "") {
      alert('Please add username!')
      return
    } else if(this.state.text === "") {
      alert('Please add comment!')
      return
    }

    const key = firebaseDb.ref('chatrooms/').push().key;
    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/' + key).set({
      "id": key,
      "userName" : this.state.userName,
      "text" : this.state.text,
    })

    this.setState({userName: "", text: ""})
  }

  render() {
    return (
      <div className="App">
        <h1>Chat</h1>
        <div className="MessageList">
          {this.state.messages.map((m, i) => <h2 key={i}>@{m.userName} {m.text}</h2>)}
        </div>
        <CommentBox
          onTextChange={this.onTextChange}
          onButtonClick={this.onButtonClick}
          userName={this.state.userName}
          text={this.state.text}
        />
        <Link to="/">Back to Home</Link>
      </div>
    );
  }
}

export default ChatRoom;