import React, { Component } from 'react'
import { connect } from 'react-redux';
import ChipInput from 'material-ui-chip-input'

import { firebaseDb } from '../config/firebase.js';
import { TextField, Card, Button } from '@material-ui/core';

class EditChatRoom extends Component {
  state = {
    title: '',
    description: '',
    place: '',
    tags: [],
  }

  componentDidMount() {
    const chatRoomId = this.props.match.params.id;

    if (chatRoomId) {
      firebaseDb.ref('chatrooms/' + chatRoomId).on('value', (snapshot) => {
        this.setState(snapshot.val())
      })
    } else {
      this.setState(() => ({title: '', description: '', place: '', tags: []}))
    }
  }

  onTextChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onFormSubmit = (e) => {
    e.preventDefault()

    const id = this.state.id || firebaseDb.ref('chatrooms').push().key;
    firebaseDb.ref('chatrooms/' + id).set({
      "id": id,
      "owner" : this.props.user.loginUser,
      ...this.state
    }).then(() => {
      console.log('id: ', id)
      
      firebaseDb.ref('chatrooms/' + id + '/roommembers/' + this.props.user.loginUser.id)
        .set(this.props.user.loginUser, () => this.props.history.push(`/chatroom/${id}`))
      
    })
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
              value={this.state.tags}
              onAdd={tag => this.setState({tags: this.state.tags.concat(tag)})}
              onDelete={(tag, index) => this.setState({tags: this.state.tags.filter(t => t !== tag)})}
            />
            <Button color="primary" variant="contained" type="submit">{this.state.id ? 'Edit' : 'Create'} ChatRoom</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditChatRoom)
