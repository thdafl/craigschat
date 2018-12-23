import React, {Component} from 'react'

import {firebaseDb} from '../config/firebase'

const cache = {}
const onLoad = {}

class ProfileCache extends Component {
  state = {
    profile: null
  }

  componentDidMount() {
    const {id} = this.props
    
    if (!cache[id]) {
      // If not already fetching
      if (!onLoad[id]) {
        onLoad[id] = []
        
        firebaseDb.ref('users/' + id).on('value', snapshot => {
          cache[id] = snapshot.val()

          onLoad[id].forEach(cb => {
            cb(cache[id])
          })
        })
      }

      onLoad[id].push(profile => this.setState({profile}))
    } else {
      this.setState({profile: cache[id]})
    }
  }
  
  render() {
    return (
      this.state.profile
        ? this.props.cb(this.state.profile)
        : null
    )
  }
}

export default function getProfile(id, cb) {
  return <ProfileCache key={id} id={id} cb={cb}/>
}
