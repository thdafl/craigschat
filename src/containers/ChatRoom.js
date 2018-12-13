import React, { Component } from 'react';
import moment from 'moment';
import { firebaseDb, firebaseAuth } from '../config/firebase.js';
import { userLogin, userLogout } from '../store/users/actions';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Hidden from '@material-ui/core/Hidden';
import Header from './Header';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text : "",
      messages : [],
      initialMessagesLength: null
    }

    this.onTextChange = this.onTextChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentWillMount() {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        firebaseDb.ref('users/' + user.uid).on('value', (snapshot) => {
          if (snapshot.exists()) {
            const user = snapshot.val()
            this.props.login(user);
          } else {
            this.props.logout();
          }
        })
      }
    })

    const chatRoomId = this.props.match.params.id;
    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/').once('value', (snapshot) => { 
      this.setState({ initialMessagesLength: snapshot.numChildren()})     
      console.log("willmount", snapshot.numChildren())
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
  }

  componentDidMount() {
    if (this.messagesEnd) this.messagesEnd.scrollIntoView();
  }

  componentDidUpdate() {
    if (this.messagesEnd) this.messagesEnd.scrollIntoView({behavior: "smooth"});
    if (this.state.initialMessagesLength && this.state.initialMessagesLength < this.state.messages.length) {
      
    console.log("####", this.state.initialMessagesLength, this.state.messages.length)
    this.setState({initialMessagesLength: this.state.initialMessagesLength + 1})
    const audio = new Audio("https://firebasestorage.googleapis.com/v0/b/craigschat-230e6.appspot.com/o/water-drop2.mp3?alt=media&token=9573135c-62b9-40ae-b082-61f443d39a87")
    if (this.state.initialMessagesLength && this.state.initialMessagesLength < this.state.messages.length) audio.play();
    }
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
      photpUrl: "https://image.flaticon.com/icons/svg/145/145849.svg"
    }

    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/' + key).set({
      "id": key,
      "user" : (this.props.user) ? this.props.user : guest,
      "text" : this.state.text,
      "timestamp": moment().format("MMMM Do YYYY, h:mm a")
    })

    this.setState({userName: "", text: ""})
  }

  render() {
    return (
      <div className="App" style={{height: '100%'}}>
        <Header user={this.props.user} />

        <Grid container style={{height: '100%', position: 'fixed'}}> 
          
          <Hidden xsDown>
            <Grid item sm={2} md={2} lg={2} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{display: 'flex', flexDirection: 'column', paddingTop: '80px'}}>
                left
                <Link to="/">Back to Home</Link>
              </div>
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={10} md={7} lg={7} style={{paddingTop: '55px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div id="chatbox" style={{height: '90%', width: '100%', overflowY: 'scroll'}}>
              {this.state.messages.map((m, i) => 
                <div ref={(el) => { this.messagesEnd = el; }} key={i} style={{fontSize: '20px', display: 'flex', alignItems: 'center', margin: '10px'}}>
                  <div style={{display: 'flex', marginRight: '10px', width: '15%'}}>
                    <Avatar style={{width: '30px', height: '30px', marginRight: '10px'}} alt="user-avator" src={m.user.photpUrl} />
                    <div style={{display: 'flex', alignItems: 'center', color: 'gray', fontSize: '10px'}}>@{m.user.name}</div>
                  </div>
                  <div style={{textAlign: 'left', paddingRight: '10px', width: '75%', fontSize: '20px'}}>{m.text}</div>
                  <div style={{color: 'gray', fontSize: '5px', width: '10%'}}>{m.timestamp}</div>
                </div>
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
                right
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
  login: (user) => dispatch(userLogin(user)),
  logout: () => dispatch(userLogout())
})

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);