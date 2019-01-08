import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import Event from '@material-ui/icons/Event';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';

const ChatRoomDetails = React.memo(({chatroom, editable, onDelete, onEdit, onCreateEvent }) => {
  return (
    <div>
      <div style={{display: 'flex'}}>
        {editable && 
        <Tooltip title="Create Event" onClick={() => onCreateEvent(chatroom)}>
          <IconButton aria-label="Create Event">
            <Event />
          </IconButton>
        </Tooltip>} 
        {editable && 
        <Tooltip title="Edit Details" onClick={() => onEdit(chatroom)}>
          <IconButton aria-label="Edit Details">
            <Edit />
          </IconButton>
        </Tooltip>} 
        {editable && 
        <Tooltip title="Delete ChatRoom" onClick={() => onDelete(chatroom)}>
          <IconButton aria-label="Delete Chatroom">
            <DeleteIcon />
          </IconButton>
        </Tooltip>}
      </div>
      {chatroom && (
        <div style={{display: 'flex', flexDirection: 'column', textAlign: 'left', paddingLeft: 15}}>  
          <h2 style={{marginBlockStart: 5}}>{chatroom.title}</h2>
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
