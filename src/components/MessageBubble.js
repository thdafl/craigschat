import React from 'react'
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment'
import TimeAgo from 'react-timeago'
import getProfile from '../hocs/ProfileCache.js';

class MessageBubble extends React.Component {
  state = {
    imageHeight: 260,
  }

  renderComment(message) {
    if (message.text) {
      return <div style={{textAlign: 'left', fontSize: 14, fontWeight: 300, wordBreak: 'break-all'}}>{message.text}</div>
    } else if (message.image) {
      const img = new Image();
      img.src = message.image;
      img.onload = () => {
        this.setState({imageHeight: img.height});
      }
      return (
        <div style={{textAlign: 'left'}}>
          <img src={message.image} alt="messageImage" style={{border: 'solid 1px gray', maxHeight: 250, maxWidth: '80%', height: this.state.imageHeight}}></img>
        </div>
      )
    }
  }

  render () {
    const {user, message, onDelete} = this.props;

    return (
    <div style={{fontSize: '20px', display: 'flex', margin: '10px 20px 10px 20px'}}>
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
        {this.renderComment(message)}
      </div>
    </div>
    )
  }
}

export default MessageBubble
