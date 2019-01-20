import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Card } from '@material-ui/core';

const ChatRoomEvents = React.memo(({ editable, events, onDelete, onUpdate }) => {
  return (
    <div>
      <div style={{display: 'flex'}}>
        <Typography style={{color: 'white', fontSize: 20, fontWeight: 600, textAlign: 'start'}}>Scheduled Events</Typography>
      </div>
      <div>
        {(events.length) ? 
          events.map((event, id) => {
            return (
              <Card id={id} style={{display: 'flex', flexDirection: 'column', marginTop: 10, marginBottom: 10, padding: 10}}>
                <Typography style={{color: 'rgb(83, 175, 135)', fontSize: 15, fontWeight: 600, textAlign: 'start', paddingRight: 10}}>{event.dateString}, {event.time}</Typography>
                <Typography style={{color: 'black', fontSize: 18, fontWeight: 600, textAlign: 'start', paddingRight: 10}}>{event.title} @{event.venue}</Typography>
                <Typography style={{color: 'black', fontSize: 15, fontWeight: 400, textAlign: 'start', paddingRight: 10}}>{event.title} @{event.details}</Typography>
                  {editable && <div style={{display: 'flex'}}>
                    <div style={{ color: 'gray', fontSize: 15, cursor: 'pointer', paddingRight: 5 }} onClick={() => onUpdate(event)}>
                      Update
                    </div>
                    <div style={{ color: 'red', fontSize: 15, cursor: 'pointer' }} onClick={() => onDelete(event.eventId)}>
                      Delete
                    </div>
                  </div>}
              </Card>
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