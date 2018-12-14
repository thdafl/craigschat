import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment'
import TimeAgo from 'react-timeago'

const MessageBubble = ({message}) => (
  <div style={{fontSize: '20px', display: 'flex', margin: '10px'}}>
    <Avatar style={{width: '30px', height: '30px', marginRight: '10px'}} alt="user-avator" src={message.user.photoUrl} />
    <div>
      <div style={{display: 'flex', marginBottom: 5}}>
        <div style={{color: 'gray', fontSize: '10px'}}>@{message.user.name}</div>
        <div style={{color: 'gray', fontSize: '10px', marginLeft: 10}}><TimeAgo date={moment(message.timestamp).toDate()} minPeriod={30}/></div>
      </div>
      <div style={{textAlign: 'left', paddingRight: '10px', width: '75%', fontSize: '20px', wordBreak: 'break-all'}}>{message.text}</div>
    </div>
  </div>
)

export default MessageBubble
