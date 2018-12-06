import React, { Component } from 'react';
import '../App.css';
import { firebaseDb } from '../config/firebase.js';
import { withRouter } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      ownerName: "",
      description : "",
      chatRooms: []
    }

    this.onTextChange = this.onTextChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onGoToChatButtonClick = this.onGoToChatButtonClick.bind(this);
  }

  componentWillMount() {
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

  render() {
    return (
      <div className="App">
        <div>
          <h3>Welcome to CraigsChat!</h3>
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

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {this.state.chatRooms.map((chat, id) => {
            return (
              <div key={id} style={{marginBottom: '20px', paddingBottom: '15px', width: '50%'}}>
                <h2>@{chat.ownerName} - {chat.description}</h2>
                <button onClick={() => this.onGoToChatButtonClick(chat.id)}>Join this Chatroom</button>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default withRouter(Home);