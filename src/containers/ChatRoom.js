import React, { Component } from 'react';
import moment from 'moment';
import { firebaseDb } from '../config/firebase.js';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import { Badge, Button, withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import getProfile from '../hocs/ProfileCache.js';
import MessageBubble from '../components/MessageBubble'
import { Button } from '@material-ui/core';

const CHUNK_SIZE = 10

const styles = theme => ({
  badge: {
    top: 20,
    right: -20,
    height: 10,
    width: 10
  },
})

const CHUNK_SIZE = 10

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/').limitToFirst(1).once('value', (snapshot) => {
      this.setState({firstMessageId: Object.keys(snapshot.val())[0]})
    })

    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/').limitToLast(CHUNK_SIZE).once('value', (snapshot) => { 
      this.setState({messages: Object.values(snapshot.val())})

      firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/').on('child_added', (snapshot) => {
        const m = snapshot.val()
        if (m.id <= this.state.messages[this.state.messages.length - 1].id) return
        let msgs = this.state.messages
  
        msgs.push(m)
  
        this.setState({
          messages : msgs
        })
        new Audio("https://firebasestorage.googleapis.com/v0/b/craigschat-230e6.appspot.com/o/water-drop2.mp3?alt=media&token=9573135c-62b9-40ae-b082-61f443d39a87").play()
      })
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

    if (this.messagesEnd) this.messagesEnd.scrollIntoView({behavior: "instant"})
  }

  componentDidUpdate() {
    if (this.messagesEnd) this.messagesEnd.scrollIntoView({behavior: "instant"})
  }

  loadEarlier = () => {
    const {id: chatRoomId} = this.props.match.params
    
    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/')
      .orderByKey()
      .limitToLast(CHUNK_SIZE)
      .endAt(this.state.messages[0].id)
      .once('value', (snapshot) => {
        this.setState(({messages}) => ({messages: Object.values(snapshot.val()).concat(messages.slice(1))}))
      })
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
                    <Badge badgeContent="" color={user.online ? 'primary' : 'error'} classes={{ badge: this.props.classes.badge }}>
                      <div key={user.id} style={{display: 'flex', alignItems: 'center', margin: '5px'}}>
                        <Avatar alt="user avatar" src={user.photoUrl} style={{marginRight: '10px'}}/>
                        <div style={{wordBreak: 'break-all'}}>{user.name}</div>
                      </div>
                    </Badge>
                  ))
                )}
                <Link to="/" style={{marginTop: '15px'}}>Back to Home</Link>
              </div>
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={10} md={7} lg={7} style={{paddingTop: '55px', display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: '100%'}}>
            <div id="chatbox" style={{height: '90%', width: '100%', overflowY: 'scroll'}}>
              {this.state.messages[0] && this.state.messages[0].id > this.state.firstMessageId && <Button onClick={this.loadEarlier} fullWidth>Load Earlier</Button>}
              {this.state.messages.map((m, i) => 
                <div key={i} ref={(el) => { this.messagesEnd = el; }}><MessageBubble key={i} message={m}/></div>
              )}
            </div>
            <form onSubmit={this.onButtonClick} style={{height: '10%', width: '90%',paddingBottom: '20px'}}>
              <TextField
                id="comment-box"
                margin="normal"
                variant="outlined"
                onChange={this.onTextChange}
                value={this.state.text}
                style={{width: '100%'}}
              />
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
