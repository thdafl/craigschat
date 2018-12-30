import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const ChatRoomDetails = React.memo(({chatroom, editable, onDelete, onEdit}) => {
  return (
    <div>
      <div>
        {editable && <Button size='small' variant="outlined" color="primary" onClick={() => onEdit(chatroom)}>Edit Details</Button>}
        {editable && <Button size='small' variant="outlined" color="secondary" onClick={() => onDelete(chatroom)}>Delete Chatroom</Button>}
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
})

const styles = theme => ({
  example: {
    width: '95%',
    height: 300,
    margin: 10,
    float: 'left'
  }
});

export default withStyles(styles)(ChatRoomDetails);
