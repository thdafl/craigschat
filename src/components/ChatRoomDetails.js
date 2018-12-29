import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const ChatRoomDetails = () => {
  return (
    <div>
      <div>
        <Button size='small' variant="outlined" color="primary">Edit Details</Button>
        <Button size='small' variant="outlined" color="secondary">Delete Chatroom</Button>
      </div>
      <div>Chatowner</div>
      <div>ChatDetails</div>
      <div>etc...</div>
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
