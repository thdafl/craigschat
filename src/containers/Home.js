import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';
import '../App.css';
import { firebaseDb } from '../config/firebase.js';
import { withRouter } from 'react-router-dom';
import ListCard from '../components/ListCard';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      id: "",
      description : "",
      chatRooms: []
    }

    this.onGoToChatButtonClick = this.onGoToChatButtonClick.bind(this);
  }

  componentDidMount() {
    firebaseDb.ref('chatrooms').on('child_added', (snapshot) => {
      const ctr = snapshot.val()
      const chatrooms = this.state.chatRooms

      chatrooms.push({
        id: ctr.id,
        owner : ctr.owner,
        title: ctr.title,
        tags: ctr.tags,
        place: ctr.place,
        description : ctr.description,
        roommembers: ctr.roommembers
      })

      this.setState({
        chatRooms : chatrooms
      });
    })
  }

  onGoToChatButtonClick(id) {
    this.props.history.push(`/chatroom/${id}`);
  }

  render() {
    return (
      <div className="App" style={{display: 'flex', justifyContent: 'center', height: '100%', paddingLeft: '5%', paddingRight: '5%'}}>
        <div style={{width: '100%', paddingTop: 80}}>
          <Grid container>
            <Hidden mdDown>
              <Grid item lg={3} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Paper square={true} style={{display: 'flex', justifyContent: 'center', width: '90%', marginTop: '10px', marginBottom: '10px', height: 500}}>
                </Paper>
              </Grid>
            </Hidden>

            <Grid item xs={12} sm={12} md={8} lg={6} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>       
              {this.state.chatRooms.map((chatroom, id) => {
                return (
                  <ListCard
                    key={id}
                    onClick={() => this.onGoToChatButtonClick(chatroom.id)}
                    {...chatroom}
                  />
                )
              })}

              {(this.props.user.loginUser) ? <div style={{marginBottom: '20px'}}>
                <Link to="/new/chatroom"></Link>
              </div> : null}
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={3} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Paper square={true} style={{display: 'flex', justifyContent: 'center', width: '90%', marginTop: '10px', marginBottom: '10px', height: 100}}></Paper>
              <Paper square={true} style={{display: 'flex', justifyContent: 'center', width: '90%', marginTop: '10px', marginBottom: '10px', height: 300}}></Paper>
            </Grid>

          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.users
})

const mapDispatchToProps = (dispatch) => ({
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
