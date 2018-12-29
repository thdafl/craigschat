import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const ChatRoomDetails = ({chatroom}) => {
  return (
    <div>
      <div>
        <Button size='small' variant="outlined" color="primary">Edit Details</Button>
        <Button size='small' variant="outlined" color="secondary">Delete Chatroom</Button>
      </div>
      {chatroom && (
        <div style={{display: 'flex', flexDirection: 'column', textAlign: 'left'}}>  
          <h2>{chatroom.title}</h2>
          <span>@{chatroom.place}</span>
          <p>{chatroom.description}</p>
          <div>
            {(chatroom.tags || []).map(tag => <a href="#" style={{marginRight: 5, textDecoration: 'none'}}>{`#${tag}`}</a>)}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = theme => ({
  example: {
    width: '95%',
    height: 300,
    margin: 10,
    float: 'left'
  }
});

export default withStyles(styles)(ChatRoomDetails);
