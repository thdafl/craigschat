import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Card, Avatar, Button, TextField } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import {firebaseDb, firebaseAuth} from '../config/firebase'
import { userLogout } from '../store/users/actions';

class UserProfile extends Component {
  state = {
    isEditting: false,
    profile: {}
  }
  
  deleteAccount = async () => {
    const {credential} = await firebaseAuth.signInWithPopup(require('../config/firebase')[this.props.user.loginUser.provider.split('.')[0] + 'Provider'])
    
    await firebaseDb.ref('chatrooms/').once('value', (snapshot) => { 
      snapshot.forEach(cr => {
        if (cr.val().owner.id === this.props.user.loginUser.id) {
          firebaseDb.ref('chatrooms/' + cr.val().id + '/archived/').set(true)
        }
      })
    })
    await firebaseAuth.currentUser.reauthenticateAndRetrieveDataWithCredential(credential)
    await firebaseAuth.currentUser.delete()
    await firebaseAuth.signOut()
    await firebaseDb.ref('users/' + this.props.user.loginUser.id + '/deleted/').set(true)
    await this.props.logout()
    this.props.history.push("/")
  }

  toggleEdit = () => {
    this.setState({
      isEditting: !this.state.isEditting,
      profile: this.props.user.loginUser
    })
  }

  onFieldChange = (e) => {
    this.setState({profile: {...this.state.profile, [e.target.name]: e.target.value}})
  }

  onFormSubmit= e => {
    e.preventDefault()

    firebaseDb.ref('users/' + this.props.user.loginUser.id).set(this.state.profile, this.toggleEdit)
  }
  
  render() {
    const {loginUser} = this.props.user
    const {isEditting, profile} = this.state

    return loginUser ? (
      <div className="App" style={{height: '100vh'}}>
        <div style={{width: '100%', paddingTop: 80}}>
          <Card style={{display: 'flex', padding: 20, flexDirection: 'row', margin: 'auto', maxWidth: 700}}>
            <Avatar style={{width: '75px', height: '75px', marginRight: 40, top: 0}} src={loginUser.photoUrl} />
            <div style={{textAlign: 'left'}}>
              {isEditting ? (
                <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={this.onFormSubmit}>
                  <TextField name="name" label="Name" value={profile.name} onChange={this.onFieldChange}/>
                  <TextField name="email" label="Email" value={profile.email} type="email" onChange={this.onFieldChange}/>
                  <TextField name="description" label="About me" value={profile.description} rows={4} onChange={this.onFieldChange} multiline/>
                  <Button color="primary" variant="raised" type="submit">Save</Button>
                </form>
              ) : (
                <>
                  <h2 style={{margin: 5, marginLeft: 0}}>{loginUser.name}</h2>
                  <div>{loginUser.email}</div>
                </>
              )}
            </div>
            {!isEditting && <Button style={{marginLeft: 'auto'}} onClick={this.toggleEdit}>Edit</Button>}
          </Card>

          <Button style={{color: 'red'}} onClick={this.deleteAccount}>Delete Account</Button>
        </div>
      </div>
    ) : null
  }
}

const mapStateToProps = state => ({
  user: state.users || {}
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(userLogout())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile))
