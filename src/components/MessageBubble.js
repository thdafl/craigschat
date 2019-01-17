import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment'
import TimeAgo from 'react-timeago'
import getProfile from '../hocs/ProfileCache.js';

const MessageBubble = ({user, message, onDelete}) => (
  <div style={{fontSize: '20px', display: 'flex', margin: '10px'}}>
    {(message.user.name === 'Guest') 
      ? <Avatar style={{width: '30px', height: '30px', marginRight: '10px'}} alt="user-avator" src={'https://image.flaticon.com/icons/svg/145/145849.svg'} />
      : getProfile(message.user.id, u => {
        if (u.deleted) {
          return <Avatar style={{width: '30px', height: '30px', marginRight: '10px'}} alt="user-avator" src={'https://image.flaticon.com/icons/svg/660/660611.svg'} />
        } else {
          return <Avatar style={{width: '30px', height: '30px', marginRight: '10px'}} alt="user-avator" src={u.photoUrl} />
        }
      })
    }
    <div>
      <div style={{display: 'flex', marginBottom: 5}}>
        {(message.user.name === 'Guest') 
          ? <div style={{color: 'gray', fontSize: '10px'}}>Guest Member</div>
          : getProfile(message.user.id, u => {
            if (u.deleted) {
              return <div style={{color: 'gray', fontSize: '10px'}}>Past Member</div>
            } else {
              return <div style={{color: 'gray', fontSize: '10px'}}>@{u.name}</div>
            }
          })
        }
        <div style={{color: 'gray', fontSize: '10px', marginLeft: 10, paddingRight: 10}}><TimeAgo date={moment(message.timestamp).toDate()} minPeriod={30}/></div>
        {user && user.id === message.user.id && <span style={{cursor: 'pointer', color: 'red', fontSize: 10}} onClick={() => onDelete(message)}>Delete</span>}
      </div>
      {(message.text) && <div style={{textAlign: 'left', fontSize: '1rem', fontWeight: 100, wordBreak: 'break-all'}}>{message.text}</div>}
      {(message.image) && <div style={{textAlign: 'left'}}>
        <img src={message.image} width="50%" alt="messageImage" style={{border: 'solid 1px gray'}}></img>
      </div>}
    </div>
  </div>
)

export default MessageBubble
