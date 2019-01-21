import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Card } from '@material-ui/core';

const ChatRoomEvents = React.memo(({ events, openEventDialog }) => {
  return (
    <div>
      <div style={{display: 'flex'}}>
        <Typography style={{color: 'white', fontSize: 20, fontWeight: 600, textAlign: 'start'}}>Scheduled Events</Typography>
      </div>
      <div>
        {(events.length) ? 
          events.map((event, id) => {
            return (
              <Card id={id} onClick={() => openEventDialog(event)} style={{display: 'flex', flexDirection: 'column', marginTop: 10, marginBottom: 10, padding: 20, cursor: 'pointer'}}>
                <Typography style={{color: 'rgb(83, 175, 135)', fontSize: 15, fontWeight: 600, textAlign: 'start', paddingRight: 10}}>{event.dateString}, {event.time}</Typography>
                <Typography style={{color: 'black', fontSize: 18, fontWeight: 600, textAlign: 'start', paddingRight: 10}}>{event.title} @{event.venue}</Typography>
                <Typography style={{color: 'black', fontSize: 15, fontWeight: 400, textAlign: 'start', paddingRight: 10}}>{event.title} @{event.details}</Typography>
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