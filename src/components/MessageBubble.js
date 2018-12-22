import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment'
import TimeAgo from 'react-timeago'

const MessageBubble = ({user, message, onDelete}) => (
  <div style={{fontSize: '20px', display: 'flex', margin: '10px'}}>
    <Avatar style={{width: '30px', height: '30px', marginRight: '10px'}} alt="user-avator" src={message.user.photoUrl} />
    <div>
      <div style={{display: 'flex', marginBottom: 5}}>
        <div style={{color: 'gray', fontSize: '10px'}}>@{message.user.name}</div>
        <div style={{color: 'gray', fontSize: '10px', marginLeft: 10}}><TimeAgo date={moment(message.timestamp).toDate()} minPeriod={30}/></div>
      </div>
      <div style={{textAlign: 'left', fontSize: '1.2rem', fontWeight: 300, wordBreak: 'break-all'}}>{message.text}</div>
    </div>
    <div style={{marginLeft: 'auto'}}></div>
    {user && user.id === message.user.id && <span style={{cursor: 'pointer', color: 'red', fontSize: 10}} onClick={() => onDelete(message)}>Delete</span>}
  </div>
)

export default MessageBubble
