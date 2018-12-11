import React, { Component } from 'react';
import { firebaseDb, firebaseAuth } from '../config/firebase.js';
import { userLogin, userLogout } from '../store/users/actions';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Hidden from '@material-ui/core/Hidden';
import Header from './Header';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class ChatRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text : "",
      messages : []
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
    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/').on('child_added', (snapshot) => {
      const m = snapshot.val()
      let msgs = this.state.messages

      msgs.push({
        id: m.id,
        text : m.text,
        userName : m.userName,
      })

      this.setState({
        messages : msgs
      });
    })
  }

  componentDidMount() {
    if (this.messagesEnd) this.messagesEnd.scrollIntoView({behavior: "smooth"});
  }

  componentDidUpdate() {
    if (this.messagesEnd) this.messagesEnd.scrollIntoView({behavior: "smooth"});
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
    firebaseDb.ref('chatrooms/' + chatRoomId + '/messages/' + key).set({
      "id": key,
      "userName" : (this.props.user) ? this.props.user.name : "Guest",
      "text" : this.state.text,
    })

    this.setState({userName: "", text: ""})
  }

  render() {
    return (
      <div className="App" style={{height: '100%'}}>
        <Header user={this.props.user} />

        <Grid container style={{height: '100%', position: 'fixed'}}> 
          
          <Hidden xsDown>
            <Grid item sm={2} md={2} lg={2} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'cornsilk'}}>
              <div style={{display: 'flex', flexDirection: 'column', paddingTop: '80px'}}>
                left
                <Link to="/">Back to Home</Link>
              </div>
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={10} md={7} lg={7} style={{paddingTop: '55px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'bisque'}}>
            <div id="chatbox" style={{height: '90%', width: '100%', overflowY: 'scroll'}}>
              {this.state.messages.map((m, i) =>
                <div ref={(el) => { this.messagesEnd = el; }} key={i} style={{fontSize: '20px', display: 'flex', alignItems: 'flex-start', margin: '10px'}}>
                  @{m.userName} {m.text}
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
            <Grid item md={3} lg={3} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'mistyrose'}}>
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