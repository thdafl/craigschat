import React, { Component } from 'react'
import { connect } from 'react-redux';
import ChipInput from 'material-ui-chip-input'
import { firebaseDb, firebaseStorage } from '../config/firebase.js';
import { TextField, Card, Button, CircularProgress } from '@material-ui/core';
import FileUploader from "react-firebase-file-uploader";

class EditChatRoom extends Component {
  state = {
    image: '',
    title: '',
    description: '',
    place: '',
    tags: [],
    imageSaving: false
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
      firebaseDb.ref('chatrooms/' + id + '/roommembers/' + this.props.user.loginUser.id)
        .set(this.props.user.loginUser, () => this.props.history.push(`/chatroom/${id}`))
      
    })
  }

  handleUploadStart = () => {
   this.setState({ imageSaving: true })
  }

  handleImageChange = filename => {
    firebaseStorage
      .ref('chatroomImage')
      .child(filename)
      .getDownloadURL()
      .then(photoUrl => this.setState({image: photoUrl}))
    this.setState({ imageSaving: false })
  }
  
  render() {
    return (
      <div style={{width: '100%', paddingTop: 80}}>
        <Card style={{margin: 'auto', width: 600, padding: 20}}>
          <div>
            <label style={{backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, pointer: 'cursor'}}>
                {(this.state.imageSaving) ? <CircularProgress size={15} /> : "Select Chatroom Image"}
                <FileUploader
                  hidden
                  accept="image/*"
                  storageRef={firebaseStorage.ref('chatroomImage')}
                  onUploadStart={this.handleUploadStart}
                  // onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleImageChange}
                />
            </label>
            <div style={{paddingTop: 20}}>{(this.state.image) ? <img border="0" src={this.state.image} width="50%" alt="chatroomimage"></img>: "No file selected"}</div>
          </div>
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
  user: state.usersReducer
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(EditChatRoom)
