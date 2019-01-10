import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';
import '../App.css';
import { firebaseDb } from '../config/firebase.js';
import { withRouter } from 'react-router-dom';
import ListCard from '../components/ListCard';
import { Typography, Card, Grid, Hidden, withStyles } from '@material-ui/core';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      id: "",
      description : "",
      chatRooms: [],
      display: ''
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
        roommembers: ctr.roommembers,
        archived: ctr.archived
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
    const {loginUser: user = {}} = this.props.user
    const {chatRooms} = this.state

    const ownedRooms = chatRooms.filter(({owner}) => user && owner.id === user.id)
    const joinedRooms = chatRooms.filter(({roommembers}) => user && roommembers[user.id])
    
    return (
      <div className="App" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%'}}>
        <div className={this.props.classes.jumbotronContents}>
          <Typography style={{fontSize: '3rem', fontWeight: 700}}>Chat. Build Community.</Typography>
          <Typography style={{fontSize: '1rem', fontWeight: 200, color: 'gray'}}>This service operates only in Tokyo now in Beta</Typography>
        </div>

        <div style={{width: '100%', paddingTop: 20}}>
          <Grid container style={{display: 'flex', justifyContent: 'center'}}>
            <Grid item xs={12} sm={12} md={12} lg={8} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Grid container> 
                {(this.state.display === 'owner' ? ownedRooms : this.state.display === 'joined' ? joinedRooms : this.state.chatRooms).map((chatroom, id) => {
                  if(!chatroom.archived) {
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={4} key={id} style={{display: 'flex', justifyContent: 'center'}}>
                        <ListCard
                          key={id}
                          onClick={() => this.onGoToChatButtonClick(chatroom.id)}
                          {...chatroom}
                        />
                      </Grid>
                    )
                  }
                  return null
                })}

                {(this.props.user.loginUser) ? <div style={{marginBottom: '20px'}}>
                  <Link to="/new/chatroom"></Link>
                </div> : null}
              </Grid>
            </Grid>

            <Hidden mdDown>
              <Grid item xs={12} sm={12} md={4} lg={2} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: '95%', marginTop: '10px', position: 'sticky', top: '50px'}}>
                  {user && (
                    <Card raised={false} style={{padding: 18}}>
                      <div style={{display: 'flex', alignItems: 'flex-end', padding: 3}} onClick={() => this.setState({display: 'owner'})}>
                        <Typography style={{fontSize: 20, marginRight: 10}}>{ownedRooms.length}</Typography>
                        <Typography style={{fontSize: 12, fontWeight: 100, color: 'gray', paddingBottom: 3}}>Chatrooms you own</Typography>
                      </div>
                      <div style={{display: 'flex', alignItems: 'flex-end', padding: 3}} onClick={() => this.setState({display: 'joined'})}>
                        <Typography style={{fontSize: 20, marginRight: 10}}>{joinedRooms.length}</Typography>
                        <Typography style={{fontSize: 12, fontWeight: 100, color: 'gray', paddingBottom: 3}}>Chatrooms you joined</Typography>
                      </div>
                    </Card>
                  )}
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '15px'}}>
                    <Link to="/" style={{fontSize: 15, fontWeight: 100, color: 'gray', textDecoration: 'none', padding: 3}}>About</Link>
                    <Link to="/" style={{fontSize: 15, fontWeight: 100, color: 'gray', textDecoration: 'none', padding: 3}}>Terms and Conditions</Link>
                    <Link to="/" style={{fontSize: 15, fontWeight: 100, color: 'gray', textDecoration: 'none', padding: 3}}>Privacy Policy</Link>
                  </div>
                </div>
                
              </Grid>
            </Hidden>
          </Grid>
        </div>
      </div>
    );
  }
}
const styles = theme => ({
  jumbotronContents: {
    paddingTop: 100,
    minHeight: 150
  }
})

const mapStateToProps = (state) => ({
  user: state.users
})

const mapDispatchToProps = (dispatch) => ({
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home)));
