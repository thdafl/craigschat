import React from 'react'
import Avatar from '@material-ui/core/Avatar';

const MessageBubble = ({message}) => (
  <div style={{fontSize: '20px', display: 'flex', alignItems: 'center', margin: '10px'}}>
    <Avatar style={{width: '30px', height: '30px', marginRight: '10px'}} alt="user-avator" src={message.user.photoUrl} />
    <div>
      <div style={{display: 'flex'}}>
        <div style={{color: 'gray', fontSize: '10px'}}>@{message.user.name}</div>
        <div style={{color: 'gray', fontSize: '8px', marginLeft: 10}}>{message.timestamp}</div>
      </div>
      <div style={{textAlign: 'left', paddingRight: '10px', width: '75%', fontSize: '20px'}}>{message.text}</div>
    </div>
  </div>
)

export default MessageBubble
