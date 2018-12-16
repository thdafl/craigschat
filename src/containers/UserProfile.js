import React, {Component} from 'react'
import {connect} from 'react-redux'
import { Card, Avatar } from '@material-ui/core';

class UserProfile extends Component {
  render() {
    const {loginUser = {}} = this.props.user
    
    return (
      <div className="App" style={{height: '100vh'}}>
        <div style={{width: '100%', paddingTop: 80}}>
          <Card style={{display: 'flex', padding: 20, flexDirection: 'row', margin: 'auto', maxWidth: 700}}>
            <Avatar style={{width: '75px', height: '75px', marginRight: 40, top: 0}} src={loginUser.photoUrl} />
            <div style={{textAlign: 'left'}}>
              <h2 style={{margin: 5, marginLeft: 0}}>{loginUser.name}</h2>
              <div>{loginUser.email}</div>
            </div>
          </Card>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.users
})

export default connect(mapStateToProps)(UserProfile)
