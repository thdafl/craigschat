import React, { Component } from 'react';
import moment from 'moment';
import { firebaseDb } from '../config/firebase.js';
import {Picker} from 'emoji-mart'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import { Button, Popover } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import 'emoji-mart/css/emoji-mart.css'

import MessageBubble from '../components/MessageBubble'
import getProfile from '../hocs/ProfileCache.js';
import { Badge, withStyles } from '@material-ui/core';

const styles = theme => ({
  badge: {
    top: 20,
    right: -20,
    height: 10,
    width: 10
  },
})

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emojiAnchor: null,
      text : "",
      messages : [],
      currentRoomMembers: [],
      initialMessagesLength: null
    }

    this.onTextChange = this.onTextChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentDidMount() {
    const {id: chatRoomId} = this.props.match.params;

    this.chatroomRef = firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/')
    
    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/').once('value', (snapshot) => { 
      this.setState({ initialMessagesLength: snapshot.numChildren()})     
    })

    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/').on('child_added', (snapshot) => {
      const m = snapshot.val()
      let msgs = this.state.messages

      msgs.push({
        id: m.id,
        text : m.text,
        user : m.user,
        timestamp : m.timestamp
      })

      this.setState({
        messages : msgs
      });
    })

    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/').on('child_removed', snapshot => {
      const m = snapshot.val()

      this.setState(({messages}) => ({
        messages: messages.filter(msg => msg.id !== m.id)
      }))
    })

    // fetch currect roomMembers before DOM is mounted and set them to currentRoomMembers state
    firebaseDb.ref('chatrooms/' + chatRoomId + '/roommembers/').on('child_added', (snapshot) => { 
      const m = snapshot.val() 
      let crms = this.state.currentRoomMembers

      crms.push({
        id: m.id,
        name: m.name,
        photoUrl: m.photoUrl
      })

      this.setState({currentRoomMembers: crms})     
    })

    if (this.messagesEnd) this.messagesEnd.scrollIntoView({behavior: "instant"});
  }

  componentDidUpdate() {
    if (this.messagesEnd) this.messagesEnd.scrollIntoView({behavior: "instant"});

    if (this.state.initialMessagesLength && this.state.initialMessagesLength < this.state.messages.length) {  
      this.setState({initialMessagesLength: this.state.initialMessagesLength + 1})
      const audio = new Audio("https://firebasestorage.googleapis.com/v0/b/craigschat-230e6.appspot.com/o/water-drop2.mp3?alt=media&token=9573135c-62b9-40ae-b082-61f443d39a87")
      if (this.state.initialMessagesLength && this.state.initialMessagesLength < this.state.messages.length) audio.play();
    } else if (this.state.initialMessagesLength === 0) {
      this.setState({initialMessagesLength: this.state.initialMessagesLength + 1})
    }
  }

  deleteMessage = (msg) => {
    this.chatroomRef.child(msg.id).remove()
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
    const guest = {
      name: "Guest",
      photoUrl: "https://image.flaticon.com/icons/svg/145/145849.svg"
    }

    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/' + key).set({
      "id": key,
      "user" : (this.props.user) ? this.props.user : guest,
      "text" : this.state.text,
      "timestamp": moment().toISOString()
    })

    const crm = this.state.currentRoomMembers;

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

  toggleEmoji = e => {
    if (!this.state.emojiAnchor) {
      this.setState({emojiAnchor: e.currentTarget})
    } else {
      this.setState({emojiAnchor: null})
    }
  }

  render() {
    return (
      <div className="App" style={{height: '100%'}}>
        <Grid container style={{height: '100%', position: 'fixed'}}> 
          
          <Hidden xsDown>
            <Grid item sm={2} md={2} lg={2} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{display: 'flex', flexDirection: 'column', paddingTop: '70px', maxWidth: '80%'}}>
                <div style={{fontWeight: 100, fontSize: '15px', marginBottom: '10px'}}>Room Members</div>
                {this.state.currentRoomMembers.map((m) => 
                  getProfile(m.id, user => (
                    (user.deleted) ? 
                    null :
                    <Badge badgeContent="" color={user.online ? 'primary' : 'error'} classes={{ badge: this.props.classes.badge }}>
                      <div key={user.id} style={{display: 'flex', alignItems: 'center', margin: '5px'}}>
                        <Avatar alt="user avatar" src={user.photoUrl} style={{marginRight: '10px'}}/>
                        <div style={{wordBreak: 'break-all'}}>{user.name}</div>
                      </div>
                    </Badge>
                  )
                ))}
                <Link to="/" style={{marginTop: '15px'}}>Back to Home</Link>
              </div>
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={10} md={7} lg={7} style={{paddingTop: '55px', display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: '100%'}}>
            <div id="chatbox" style={{height: '90%', width: '100%', overflowY: 'scroll'}}>
              {this.state.messages.map((m, i) => 
                <div key={m.id} ref={(el) => { this.messagesEnd = el; }}>
                  <MessageBubble user={this.props.user} message={m} onDelete={this.deleteMessage}/>
                </div>
              )}
            </div>
            <form onSubmit={this.onButtonClick} style={{display: 'flex', height: '10%', width: '90%',paddingBottom: '20px'}}>
              <TextField
                id="comment-box"
                margin="normal"
                variant="outlined"
                onChange={this.onTextChange}
                value={this.state.text}
                style={{width: '100%'}}
              />
              <Button onClick={this.toggleEmoji}>Emoji</Button>
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
            </form>
          </Grid>

          <Hidden smDown>
            <Grid item md={3} lg={3} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{display: 'flex', flexDirection: 'column', paddingTop: '80px'}}>  
                ChatRoom details come here
              </div>
            </Grid>
          </Hidden>
        </Grid>
         
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users.loginUser
})

const mapDispatchToProps = (dispatch) => ({
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChatRoom));
