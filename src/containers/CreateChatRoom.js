import React, { Component } from 'react'
import { connect } from 'react-redux';
import ChipInput from 'material-ui-chip-input'

import { firebaseDb } from '../config/firebase.js';
import { TextField, Card, Button } from '@material-ui/core';

class CreateChatRoom extends Component {
  state = {
    title: '',
    description: '',
    place: '',
    tags: [],
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

  onFormSubmit = (e) => {
    e.preventDefault()

    const {key} = firebaseDb.ref('chatrooms').push();
    firebaseDb.ref('chatrooms/' + key).set({
      "id": key,
      "owner" : this.props.user.loginUser,
      ...this.state
    }).then(() => {
      firebaseDb.ref('chatrooms/' + key + '/roommembers/' + this.props.user.loginUser.id).set(this.props.user.loginUser)
      this.props.history.push(`/chatroom/${key}`)
    })

    this.setState({key: "", ownerName: "", description: ""})
  }
  
  render() {
    return (
      <div style={{width: '100%', paddingTop: 80}}>
        <Card style={{margin: 'auto', width: 600, padding: 20}}>
          <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={this.onFormSubmit}>
            <TextField
              name="title"
              label="Title"
              value={this.state.title}
              onChange={this.onTextChange}
              required
            />
            <TextField
              name="place"
              label="Place"
              value={this.state.place}
              onChange={this.onTextChange}
            />
            <TextField
              name="description"
              label="Description"
              value={this.state.description}
              onChange={this.onTextChange}
              rows={4}
              multiline
              fullWidth
            />
            <ChipInput
              label="Tags"
              onChange={tags => this.setState({tags})}
            />
            <Button color="primary" variant="contained" type="submit">Add ChatRoom</Button>
          </form>
        </Card>
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
