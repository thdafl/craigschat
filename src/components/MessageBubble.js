import React from 'react'
import Avatar from '@material-ui/core/Avatar';

const MessageBubble = ({message}) => (
  <div style={{fontSize: '20px', display: 'flex', alignItems: 'center', margin: '10px'}}>
    <div style={{display: 'flex', marginRight: '10px', width: '15%'}}>
      <Avatar style={{width: '30px', height: '30px', marginRight: '10px'}} alt="user-avator" src={message.user.photpUrl} />
      <div style={{display: 'flex', alignItems: 'center', color: 'gray', fontSize: '10px'}}>@{message.user.name}</div>
    </div>
    <div style={{textAlign: 'left', paddingRight: '10px', width: '75%', fontSize: '20px'}}>{message.text}</div>
    <div style={{color: 'gray', fontSize: '5px', width: '10%'}}>{message.timestamp}</div>
  </div>
)

export default MessageBubble
