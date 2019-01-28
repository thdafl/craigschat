import React, { Component } from 'react';
import { firebaseDb } from '../config/firebase.js';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import { Link } from 'react-router-dom';
import { withStyles, CircularProgress, Typography, Chip } from '@material-ui/core';
import Circle from '@material-ui/icons/FiberManualRecord';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import ChatRoomEvents from '../components/ChatRoomEvents';
import MessageBubble from '../components/MessageBubble'
import getProfile from '../hocs/ProfileCache.js';
import 'emoji-mart/css/emoji-mart.css'
import Confirm from '../components/Confirm.js';
import ChatInput from '../components/ChatInput'
import Header from '../containers/Header';

const CHUNK_SIZE = 20

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
      
      messages : [],
      currentRoomMembers: [],
      initialMessagesLength: null,
      events: [],
      chatroom: null,
      eventDialogOpen: false,
      eventSelectedForModal: ''
    }
  }

  componentDidMount() {
    const {id: chatRoomId} = this.props.match.params;

    this.eventsRef = firebaseDb.ref("events/" + chatRoomId);

    this.eventsRef.orderByChild("sortDate").on("value", snapshot => {
      if (snapshot.val()) {
        let events = [];
        snapshot.forEach(function (child) {
          const item = child.val()
          events.push({
            date: item.date,
            title: item.title,
            venue: item.venue,
            eventId: item.id,
            details: item.details,
            dateString: item.dateString,
            time: item.time
          })
        });

        this.setState({
          events
        })
      } else {
        this.setState({events:[]})
      }
    });

    this.messagesRef = firebaseDb.ref('messages/' + chatRoomId)
    
    this.messagesRef.once('value', (snapshot) => { 
      this.setState({ initialMessagesLength: snapshot.numChildren()}, () => (this.messagesEnd) ? this.messagesEnd.scrollIntoView({behavior: "instant"}) : null)
    })

    this.messagesRef.limitToFirst(1).once('value', (snapshot) => {
      this.setState({firstMessageId: Object.keys(snapshot.val() || {})[0]})
    })

    this.messagesRef.limitToLast(CHUNK_SIZE).once('value', (snapshot) => { 
      this.setState({messages: Object.values(snapshot.val() || {})}, () => {
        this.messagesRef.on('child_added', (snapshot) => {
          const m = snapshot.val()
          if (this.state.messages[this.state.messages.length - 1] && m.id <= this.state.messages[this.state.messages.length - 1].id) return
          let msgs = this.state.messages
    
          this.setState({
            messages : msgs.concat(m)
          }, () => {
            if (this.messagesEnd) this.messagesEnd.scrollIntoView({behavior: "instant"})
          })
          // new Audio("https://firebasestorage.googleapis.com/v0/b/craigschat-230e6.appspot.com/o/water-drop2.mp3?alt=media&token=9573135c-62b9-40ae-b082-61f443d39a87").play()
        })
      })
    })

    this.messagesRef.on('child_removed', snapshot => {
      const m = snapshot.val()

      this.setState(({messages}) => ({
        messages: messages.filter(msg => msg.id !== m.id)
      }))
    })

    firebaseDb.ref('chatrooms/' + chatRoomId).on('value', (snapshot) => {
      this.setState({chatroom: snapshot.val()})
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
  }

  componentWillUnmount() {
    this.messagesRef.off()
    this.eventsRef.off()
  }

  componentDidUpdate(_, prevState) {
    if (
      (!prevState.messages[prevState.messages.length - 1]) ||
      (this.state.messages[this.state.messages.length - 1] && prevState.messages[prevState.messages.length - 1].id < this.state.messages[this.state.messages.length - 1].id)) {
      if (this.messagesEnd) this.messagesEnd.scrollIntoView({behavior: "instant"})
    }
  }

  loadEarlier = () => {
    if (this.loadingEarlier) return
    this.loadingEarlier = true

    const {id: chatRoomId} = this.props.match.params

    const head = this.messageHead
    
    firebaseDb.ref('messages/' + chatRoomId)
      .orderByKey()
      .limitToLast(CHUNK_SIZE)
      .endAt(this.state.messages[0].id)
      .once('value', (snapshot) => {
        this.setState(
          ({messages}) => ({messages: Object.values(snapshot.val()).concat(messages.slice(1))}),
          () => {
            head.scrollIntoView({behaviour: 'instant'})
          }
        )
        this.loadingEarlier = false
      })
  }

  deleteMessage = (msg) => {
    return this.messagesRef.child(msg.id).remove()
  }

  deleteChatroom = chatroom => {
    firebaseDb.ref('chatrooms/' + chatroom.id).remove(
      this.props.history.push('/')
    )
  }

  deleteEvent = id => {
    const chatRoomId = this.props.match.params.id;
    firebaseDb.ref("events/" + chatRoomId).child(id).remove()
    this.setState({eventDialogOpen: false})
  }

  updateEvent = event => {
    const chatRoomId = this.props.match.params.id;
    this.props.history.push("/event/" + chatRoomId, event)
  }

  openEventDialog = (event) => {
    this.setState({eventDialogOpen: !this.state.eventDialogOpen, eventSelectedForModal: event})
  }

  render() {
    return (
      <div className="App" style={{height: '100%'}}>
        <Grid container style={{height: '100%', position: 'fixed', display: 'flex', justifyContent: 'center'}}> 
          <Header user={this.props.user} />
          
          <Hidden smDown>
            <Grid item sm={4} md={3} lg={3} style={{display: 'block', paddingTop: 30, height: '100%', overflow: 'auto', alignItems: 'center'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40}}>

              {(this.state.chatroom && this.props.user) && (this.state.chatroom.owner.id === this.props.user.id) ? 
                <div style={{width: '100%', display: 'flex', paddingBottom: 15}}>
                  <div style={{display: 'flex', paddingLeft: 20}}>
                    <Chip label="Create Event" style={{height: 23, backgroundColor: 'rgb(253, 203, 110)', fontSize: 11, fontWeight: 400, color: 'white', marginRight: 5}} 
                    onClick={() => this.props.history.push(`/event/${this.props.match.params.id}`)} />
                    <Chip label="Edit Room Details" style={{height: 23, backgroundColor: 'rgb(45, 152, 218)', fontSize: 11, fontWeight: 400, color: 'white', marginRight: 5}} 
                    onClick={() => this.props.history.push(`${this.props.location.pathname}/edit`)} />
                    <Confirm title={`Are you sure you want to delete Chatroom "${this.state.chatroom.title}"?`} dangerous>
                     {confirm => (
                        <Chip
                          label="Delete Room"
                          style={{height: 23, backgroundColor: 'rgb(237, 119, 111)', fontSize: 11, fontWeight: 400, color: 'white'}} 
                         onClick={confirm(() => this.deleteChatroom(this.state.chatroom))}
                        />
                      )} 
                    </Confirm>
                  </div>
                </div>
              : null }

              <div style={{width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingBottom: 15}}>
                <Typography style={{color: 'black', fontSize: 22, fontWeight: 600, textAlign: 'start', lineHeight: '2rem', paddingBottom: 10}}>{(this.state.chatroom) && this.state.chatroom.title}</Typography>
                <Typography style={{color: 'black', fontSize: 13, fontWeight: 300, textAlign: 'start'}}>{(this.state.chatroom) && this.state.chatroom.description}</Typography>
              </div>
              <div style={{width: '90%', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', paddingBottom: 5}}>
                <Chip label={(this.state.chatroom) && this.state.chatroom.place} style={{height: 23, backgroundColor: '#53af87', fontSize: 11, fontWeight: 400, color: 'white', margin: 3}} />
              </div>
              <div style={{width: '90%', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', paddingBottom: 15}}>
                {(this.state.chatroom) && 
                (this.state.chatroom.tags?
                  this.state.chatroom.tags.map((t) =>
                    <Chip key={t} label={"#" + t} style={{height: 23, backgroundColor: 'gray', fontSize: 11, fontWeight: 400, color: 'white', margin: 3}} />
                  ):
                  null)
                }
              </div>

              <div style={{width: '90%'}}>
                <ChatRoomEvents
                  events={this.state.events}
                  openEventDialog={this.openEventDialog}
                />
              </div>

              </div>

            </Grid>
          </Hidden>

          <Grid item xs={12} sm={8} md={6} lg={6} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxHeight: '100%'}}>
            <div id="chatbox" style={{height: '95%', width: '100%', overflow: 'auto'}}>
              <InfiniteScroll
                pageStart={0}
                loadMore={this.loadEarlier}
                hasMore={this.state.messages[0] && this.state.messages[0].id > this.state.firstMessageId}
                loader={<div className="loader" key={0}><CircularProgress /></div>}
                threshold={50}
                useWindow={false}
                initialLoad={false}
                isReverse
              >
                {this.state.messages.map((m, i) => 
                  <div key={m.id} ref={(el) => { if (i === 0) {this.messageHead = el}; this.messagesEnd = el; }}><MessageBubble user={this.props.user} message={m} onDelete={this.deleteMessage}/></div>
                )}
              </InfiniteScroll>
            </div>
            <ChatInput 
              {...this.props}
              currentRoomMembers={this.state.currentRoomMembers} 
            />
          </Grid>

          <Hidden mdDown>
          <Grid item md={2} lg={2} style={{display: 'block', height: '100%', paddingTop: 50, overflow: 'auto', alignItems: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20, paddingLeft: '10%', paddingRight: '10%'}}>
                {(this.state.chatroom) && getProfile(this.state.chatroom.owner.id, user => (
                  <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                  <div style={{position: 'relative'}}>
                    <Avatar alt="user avatar" src={user.photoUrl} style={{marginRight: '10px',  width: '2rem', height: '2rem', marginBottom: 5}}/>
                    {user.online ? 
                      <div style={{position: 'absolute', top: -1, right: 0, color: 'limegreen'}}><Circle style={{fontSize: 20}} /></div>
                      : <div style={{position: 'absolute', top: -1, right: 0, color: 'gray'}}><Circle style={{fontSize: 20}} /></div>
                    }
                    <div style={{position: 'absolute', top: -1, left: -8, color: 'pink'}}><span role="img" aria-label="logo">🎖 </span></div>
                  </div>
                  <Typography style={{fontSize: 14}}>{user.name}</Typography>
                  </div>
                ))}
                {this.state.currentRoomMembers.map((m) =>
                  ((this.state.chatroom) && this.state.chatroom.owner.id !== m.id) &&
                  getProfile(m.id, user => (
                    (user.deleted) ? 
                    null :
                    <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                    <div style={{position: 'relative'}}>
                      <Avatar alt="user avatar" src={user.photoUrl} style={{marginRight: '10px',  width: '2rem', height: '2rem', marginBottom: 5}}/>
                      {user.online ? 
                        <div style={{position: 'absolute', top: -1, right: 0, color: 'limegreen'}}><Circle style={{fontSize: 20}} /></div>
                        : <div style={{position: 'absolute', top: -3, right: 0, color: 'gray'}}><Circle style={{fontSize: 20}} /></div>
                      }
                    </div>
                    <Typography style={{fontSize: 14}}>{user.name}</Typography>
                    </div>
                  )
                ))}
              </div>
          </Grid>
          </Hidden>
        </Grid>

        
        <Dialog
          onClose={this.openEventDialog}
          aria-labelledby="customized-dialog-title"
          open={this.state.eventDialogOpen}
        >
          <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
            <Typography style={{color: 'rgb(83, 175, 135)', fontSize: 15, fontWeight: 600, textAlign: 'start', paddingRight: 10}}>{this.state.eventSelectedForModal.dateString} {this.state.eventSelectedForModal.time}</Typography>
            <Typography style={{color: 'black', fontSize: 25, fontWeight: 600, textAlign: 'start', paddingRight: 10}}>{this.state.eventSelectedForModal.title} @{this.state.eventSelectedForModal.venue}</Typography>
          </DialogTitle>
          <DialogContent>
          <Typography style={{color: 'black', fontSize: 17, fontWeight: 400, textAlign: 'start', paddingRight: 10}}>{this.state.eventSelectedForModal.details}</Typography>
          
          {(this.props.user && this.props.user.id) === (this.state.chatroom && this.state.chatroom.owner.id) &&
            <div>
              <div style={{ color: 'gray', fontSize: 15, cursor: 'pointer', paddingRight: 5 }} onClick={() => this.updateEvent(this.state.eventSelectedForModal)}>
                Update
              </div>
              <Confirm title={`Are you sure you want to delete Event "${this.state.eventSelectedForModal.title}"?`} dangerous>
                {confirm => (
                  <div
                    style={{ color: 'red', fontSize: 15, cursor: 'pointer' }}
                    onClick={confirm(() => this.deleteEvent(this.state.eventSelectedForModal.eventId))}
                  >
                    Delete
                  </div>
                )}
              </Confirm>
            </div>
          }
          </DialogContent>
        </Dialog>
         
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.usersReducer.loginUser
})

const mapDispatchToProps = (dispatch) => ({
})

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChatRoom));
