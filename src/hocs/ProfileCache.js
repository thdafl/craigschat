import React, {Component} from 'react'

import {firebaseDb} from '../config/firebase'

const cache = {}
const onLoad = {}

class ProfileCache extends Component {
  state = {
    profiles: {}
  }

  componentDidMount() {
    const {id} = this.props

    const ids = [].concat(id)

    ids.forEach((id, idx) => {
      // Cache hit
      if (cache[id]) {
        this.setState(({profiles}) => ({profiles: {...profiles, [id]: cache[id]}}))
        return
      }
    
      // If not already fetching
      if (!onLoad[id]) {
        onLoad[id] = []
        
        firebaseDb.ref('users/' + id).on('value', snapshot => {
          cache[id] = snapshot.val()

          onLoad[id].forEach(cb => {
            console.log(id, cache[id])
            cb(cache[id])
          })
        })
      }

      onLoad[id].push(profile => this.setState(({profiles}) => ({profiles: {...profiles, [id]: profile}})))
    })
  }
  
  render() {
    const {id, cb} = this.props
    const {profiles} = this.state

    if (Array.isArray(id)) {
      return cb(id.map(i => profiles[i]).filter(Boolean))
    } else {
      return profiles[id] ? cb(profiles[id]) : null
    }
  }
}

export default function getProfile(id, cb) {
  return <ProfileCache key={id} id={id} cb={cb}/>
}
