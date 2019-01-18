import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const ChatRoomEvents = React.memo(({ editable, events, onDelete, onUpdate }) => {
  return (
    <div>
      <div style={{display: 'flex'}}>
        <span role="img" aria-label="logo" style={{fontSize: 25}}>🎒 </span>
        <Typography style={{color: 'white', fontSize: 25, fontWeight: 600, textAlign: 'start'}}>Scheduled Events</Typography>
      </div>
      <div style={{paddingLeft: 20}}>
        {(events.length) ? 
          events.map((event, id) => {
            return (
              <div id={id} style={{display: 'flex'}}>
                <Typography style={{color: 'white', fontSize: 15, fontWeight: 600, textAlign: 'start', paddingRight: 10}}>{event.dateString} - {event.title} @{event.venue}</Typography>
                  {editable && <div style={{display: 'flex'}}>
                    <div style={{ color: 'gray', fontSize: 15, cursor: 'pointer', paddingRight: 5 }} onClick={() => onUpdate(event)}>
                      Update
                    </div>
                    <div style={{ color: 'red', fontSize: 15, cursor: 'pointer' }} onClick={() => onDelete(event.eventId)}>
                      Delete
                    </div>
                  </div>}
              </div>
            )
          }) 
        : <Typography style={{color: 'white', fontSize: 15, fontWeight: 600, textAlign: 'start', paddingRight: 10}}>No Event is scheduled yet</Typography>
        }
      </div>
    </div>
  );
});

const styles = theme => ({
  example: {
    width: "95%"
  },
  eventListing: {
    display: "flex",
    fontSize: 15,
    fontWeight: 100,
    padding: 5
  }
});

export default withStyles(styles)(ChatRoomEvents);