import React, { Component } from 'react';
import { firebaseDb } from '../config/firebase.js'
import { CommentBox } from '../components/CommentBox';

const messagesRef = firebaseDb.ref('messages')

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text : "",
      userName: "",
      messages : []
    }

    this.onTextChange = this.onTextChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentWillMount() {
    messagesRef.on('child_added', (snapshot) => {
      const m = snapshot.val()
      let msgs = this.state.messages

      msgs.push({
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
    if(this.state.userName === "") {
      alert('userName empty')
      return
    } else if(this.state.text === "") {
      alert('text empty')
      return
    }
    messagesRef.push({
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
          {this.state.messages.map((m, i) => <h2>@{m.userName} {m.text}</h2>)}
        </div>
        <CommentBox
          onTextChange={this.onTextChange}
          onButtonClick={this.onButtonClick}
          userName={this.state.userName}
          text={this.state.text}
        />
      </div>
    );
  }
}

export default ChatRoom;