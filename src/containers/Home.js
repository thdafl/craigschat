import React, { Component } from 'react';
import {Link} from 'react-router-dom'
import { connect } from 'react-redux';
import '../App.css';
import { withRouter } from 'react-router-dom';
import { fetchChatrooms } from '../store/chatroom/actions';
import ListCard from '../components/ListCard';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Hidden, CircularProgress } from '@material-ui/core';

class Home extends Component {
  constructor(props) {
    super(props);

    this.onGoToChatButtonClick = this.onGoToChatButtonClick.bind(this);
  }

  componentWillMount() {
    this.props.fetchChatrooms();
  }

  onGoToChatButtonClick(id) {
    this.props.history.push(`/chatroom/${id}`);
  }

  render() {
    return (
      <div className="App" style={{display: 'flex', justifyContent: 'center', height: '100%', paddingLeft: '10%', paddingRight: '10%'}}>
        <div style={{width: '100%', paddingTop: 60}}>
          <Grid container>
            <Hidden mdDown>
              <Grid item xs={12} sm={12} md={4} lg={3} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: '95%', marginTop: '10px', position: 'sticky', top: '50px'}}>
                  <Paper style={{padding: 18}}>
                    <div style={{display: 'flex', alignItems: 'flex-end', padding: 3}}>
                      <Typography style={{fontSize: 20, marginRight: 10}}>5</Typography>
                      <Typography style={{fontSize: 12, fontWeight: 100, color: 'gray', paddingBottom: 3}}>Chatrooms you own</Typography>
                    </div>
                    <div style={{display: 'flex', alignItems: 'flex-end', padding: 3}}>
                      <Typography style={{fontSize: 20, marginRight: 10}}>7</Typography>
                      <Typography style={{fontSize: 12, fontWeight: 100, color: 'gray', paddingBottom: 3}}>Chatrooms you joined</Typography>
                    </div>
                  </Paper>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '15px'}}>
                    <Link to="/" style={{fontSize: 15, fontWeight: 100, color: 'gray', textDecoration: 'none', padding: 3}}>About</Link>
                    <Link to="/" style={{fontSize: 15, fontWeight: 100, color: 'gray', textDecoration: 'none', padding: 3}}>Terms and Conditions</Link>
                    <Link to="/" style={{fontSize: 15, fontWeight: 100, color: 'gray', textDecoration: 'none', padding: 3}}>Privacy Policy</Link>
                  </div>
                </div>
                
              </Grid>
            </Hidden>

            <Grid item xs={12} sm={12} md={12} lg={9} style={{display: 'block'}}>
              <Grid container>
                {(!this.props.loading) ? Object.values(this.props.chatrooms || {}).map((chatroom, id) => {
                  if(!chatroom.archived) {
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={4} key={id} style={{display: 'block'}}>
                        <ListCard
                          key={id}
                          onClick={() => this.onGoToChatButtonClick(chatroom.id)}
                          {...chatroom}
                        />
                      </Grid>
                    )
                  }
                  return null 
                  }) : 
                  <div style={{width: '100%', paddingTop: 100}}>
                    <CircularProgress />
                  </div>
                }
              </Grid>
            </Grid>  

          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.userReducer.loginUser,
  chatrooms: state.chatroomsReducer.chatrooms,
  loading: state.chatroomsReducer.loading
})

const mapDispatchToProps = (dispatch) => ({
  fetchChatrooms: () => dispatch(fetchChatrooms())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
