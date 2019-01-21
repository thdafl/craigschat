import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';
import '../App.css';
import { firebaseDb } from '../config/firebase.js';
import { withRouter } from 'react-router-dom';
import Header from './Header';
import ListCard from '../components/ListCard';
import { Typography, Card, Grid, Hidden, withStyles, Button } from '@material-ui/core';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      id: "",
      description : "",
      recentUsers: "",
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
        archived: ctr.archived,
        image: ctr.image
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
    console.log(this.props.user)
    
    return (
      <div className="App" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "center", height: '100%'}}>
        <Header user={this.props.user.loginUser} />
        <div style={{width: '100%', height: 200, backgroundColor: 'rgb(38, 65, 143)', paddingTop: 80, display: 'flex', flexDirection: 'column'}}>
          <Typography style={{fontSize: '2.5rem', fontWeight: 800, paddingTop: '1rem', color: 'white'}}>We have 12 users and 23 communites</Typography>
          <Typography style={{fontSize: '1.5rem', fontWeight: 600, paddingTop: '1rem', color: 'white'}}>Join us, chat, and connect with awesome people have same interests!</Typography>
        </div>
        <div className={this.props.classes.mainContainer}>
          <Grid container style={{display: 'flex', justifyContent: 'center'}}>
            <Grid item xs={12} sm={12} md={12} lg={(this.props.user.loginUser) ? 7 : 9} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Grid container> 
                {(this.state.display === 'owner' ? ownedRooms : this.state.display === 'joined' ? joinedRooms : this.state.chatRooms).map((chatroom, id) => {
                  if (this.props.user.loginUser ? (!chatroom.archived) : (!chatroom.archived && id <= 8)) {
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={(this.props.user.loginUser) ? 4 : 3} key={id} style={{display: 'flex', justifyContent: 'center'}}>
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
              </Grid>
            </Grid>

            {(this.props.user.loginUser) &&
            <Hidden mdDown>
              <Grid item xs={12} sm={12} md={4} lg={3} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: '95%', marginTop: '10px', position: 'sticky', top: '50px'}}>
                  {(user) && 
                    <Card style={{padding: '2rem', boxShadow: 'none'}}>
                      <div style={{display: 'flex'}}>
                        <Typography style={{fontSize: '1.5rem', fontWeight: 700, paddingRight: '0.5rem'}}>Welcome Back</Typography>
                        <span role="img" aria-label="welcome" style={{fontSize: '1.5rem'}}> 🤙 </span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'flex-end', paddingTop: '0.5rem'}} onClick={() => this.setState({display: 'owner'})}>
                        <Typography style={{fontSize: 20, fontWeight: 700, marginRight: 10}}>{ownedRooms.length}</Typography>
                        <Typography style={{fontSize: 12, fontWeight: 100, color: 'gray', paddingBottom: 3}}>Chatrooms you own</Typography>
                      </div>
                      <div style={{display: 'flex', alignItems: 'flex-end'}} onClick={() => this.setState({display: 'joined'})}>
                        <Typography style={{fontSize: 20, fontWeight: 700, marginRight: 10}}>{joinedRooms.length}</Typography>
                        <Typography style={{fontSize: 12, fontWeight: 100, color: 'gray', paddingBottom: 3}}>Chatrooms you joined</Typography>
                      </div>
                      <div style={{display: 'flex', alignItems: 'flex-start', marginTop: '15px'}}>
                        <Link to="/" style={{fontSize: 15, fontWeight: 100, color: 'gray', textDecoration: 'none', padding: 3}}>About</Link>
                        <Link to="/" style={{fontSize: 15, fontWeight: 100, color: 'gray', textDecoration: 'none', padding: 3}}>Terms</Link>
                        <Link to="/" style={{fontSize: 15, fontWeight: 100, color: 'gray', textDecoration: 'none', padding: 3}}>Privacy Policy</Link>
                    </div>
                    </Card>
                  }
                </div>
                
              </Grid>
            </Hidden>
            }
          </Grid>
        </div>

        {(this.props.user.loginUser) ?
        null :
        <div style={{width: '100%'}}>
          <Button
            variant="outlined"
            // aria-owns={this.state.menuOpen ? 'simple-menu' : undefined}
            aria-haspopup="true"
            // onClick={this.onClickMenuOpen}
            size="small"
            disableRipple
            style={{background: 'linear-gradient(135deg, rgba(38, 65, 143, 1) 0%, rgba(92, 107, 192, 1) 100%)', color: 'white', fontWeight: 600, margin: 30}}
          >
            Sign In/Up to see more communites
          </Button>
          <div style={{width: '100%', height: 50, backgroundColor: 'rgb(38, 65, 143)', paddingTop: 80, display: 'flex', flexDirection: 'column'}}>
            Footer
          </div>
        </div>
        }
      </div>
    );
  }
}
const styles = theme => ({
  mainContainer: {
    paddingTop: 30,
    [theme.breakpoints.up('lg')]: {
      width: "100%"
    },
    [theme.breakpoints.up('xl')]: {
      width: "90%"
    }
  }
})

const mapStateToProps = (state) => ({
  user: state.users
})

const mapDispatchToProps = (dispatch) => ({
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home)));
