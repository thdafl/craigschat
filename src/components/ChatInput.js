import React from 'react'
import EmojiIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import IconButton from '@material-ui/core/IconButton';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import {Picker} from 'emoji-mart'
import TextField from '@material-ui/core/TextField';
import  Popover from '@material-ui/core/Popover';
import { firebaseStorage,firebaseDb } from '../config/firebase.js';
import PhotoIcon from '@material-ui/icons/AddAPhoto';
import  CircularProgress from '@material-ui/core/CircularProgress';

class ChatInput extends React.Component{
  constructor(props){
    super(props)
    this.state={
      emojiAnchor: null,
      text : "",
      imageUploading: false,
    }
  }

  onTextChange = e => {
    this.setState({
      text : e.target.value,
    });
  }

  toggleEmoji = e => {
    if (!this.state.emojiAnchor) {
      this.setState({emojiAnchor: e.currentTarget})
    } else {
      this.setState({emojiAnchor: null})
    }
  }

  handleUploadStart = () => {
    this.setState({ imageUploading: true })
  }

  handleUploadError = () => {
    this.setState({ imageUploading: false })
    alert('Upload failed. Please try again.')
  }

  handleUploadSuccess = filename => {
    firebaseStorage
    .ref('messageImage')
    .child(filename)
    .getDownloadURL()
    .then(photoUrl => {
      console.log("*", photoUrl)
      const key = firebaseDb.ref('messages/').push().key;
      const chatRoomId = this.props.match.params.id;
      const guest = {
        name: "Guest",
        photoUrl: "https://image.flaticon.com/icons/svg/145/145849.svg"
      }
      const date = new Date()

      firebaseDb.ref('messages/' + chatRoomId + '/' + key).set({
        "id": key,
        "user" : (this.props.user) ? this.props.user : guest,
        "image" : photoUrl,
        "timestamp": date.toISOString()
      })
      this.setState({ imageUploading: false }
    )
  })}

  onButtonClick = e => {
    e.preventDefault();
    const chatRoomId = this.props.match.params.id;

    if (this.state.text === "") {
      alert('Please add comment!')
      return
    }

    const key = firebaseDb.ref('messages/').push().key;
    const guest = {
      name: "Guest",
      photoUrl: "https://image.flaticon.com/icons/svg/145/145849.svg"
    }
    const date= new Date()

    firebaseDb.ref('messages/' + chatRoomId + '/' + key).set({
      "id": key,
      "user" : (this.props.user) ? this.props.user : guest,
      "text" : this.state.text,
      "timestamp": date.toISOString()
    })

    const crm = this.props.currentRoomMembers;

    // if currentRoomMembers is null, save the user to the db
    if (!crm) {
      firebaseDb.ref('chatrooms/' + chatRoomId + '/roommembers/' + this.props.user.id).set(this.props.user)
    } else {
      // if the user is guest, do nothing
      if (!this.props.user) {
        console.log("guest user!")
      // if the user is NOT existed in currentRoomMembers stets, add the user to the db
      } else if (this.props.user.id in crm === false) {
        console.log("user NOT existed!")
        firebaseDb.ref('chatrooms/' + chatRoomId + '/roommembers/' + this.props.user.id).set(this.props.user)
      } 
    }

    this.setState({userName: "", text: ""})
  }

  render(){
    return (
      <form onSubmit={this.onButtonClick} autoComplete="off" style={{display: 'flex', flexDirection: 'center', alignItems: 'center', width: '90%', paddingBottom: 10}}>
              <TextField
                id="comment-box"
                margin="normal"
                variant="outlined"
                onChange={this.onTextChange}
                value={this.state.text}
                style={{width: '100%', height: '3rem', marginTop: '8px'}}
              />
              
              <div style={{display: 'flex', paddingLeft: '10px'}}>
                <IconButton aria-label="Edit Details" onClick={this.toggleEmoji}>
                  <EmojiIcon />
                </IconButton>
                <Popover
                  open={Boolean(this.state.emojiAnchor)}
                  anchorEl={this.state.emojiAnchor}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  onClose={this.toggleEmoji}
                >
                  <Picker onSelect={({native}) => this.setState(({text}) => ({text: text + native}))} native/>
                </Popover>

                <CustomUploadButton
                  accept="image/*"
                  storageRef={firebaseStorage.ref('messageImage')}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleUploadSuccess}
                  onProgress={this.handleProgress}
                  style={{display: 'flex', alignItems: 'center', cursor: 'pointer', color: 'gray'}}
                >
                  {(this.state.imageUploading) ? <CircularProgress size={20} /> : <PhotoIcon />}
                </CustomUploadButton>
                
              </div>
            </form>
    )
  }
}

export default ChatInput