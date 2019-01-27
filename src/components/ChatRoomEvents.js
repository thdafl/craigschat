import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Card } from '@material-ui/core';

const ChatRoomEvents = React.memo(({ events, openEventDialog }) => {
  return (
    <div>
      <div style={{display: 'flex'}}>
        <Typography style={{color: 'black', fontSize: 17, fontWeight: 600, textAlign: 'start'}}>Upcomming Events</Typography>
      </div>
      <div>
        {(events.length) ? 
          events.map((event, id) => {
            return (
              <div id={id} onClick={() => openEventDialog(event)} style={{display: 'flex', flexDirection: 'column', marginTop: 5, marginBottom: 5, cursor: 'pointer'}}>
                <Typography style={{color: 'rgb(83, 175, 135)', fontSize: 12, fontWeight: 600, textAlign: 'start', paddingRight: 10}}>{event.dateString}, {event.time}</Typography>
                <Typography style={{color: 'black', fontSize: 13, fontWeight: 300, textAlign: 'start', paddingRight: 10}}>{event.title} @{event.venue}</Typography>
              </div>
            )
          }) 
        : <Typography style={{color: 'black', fontSize: 13, fontWeight: 300, textAlign: 'start', paddingRight: 10}}>No Event is scheduled yet</Typography>
        }
      </div>
      <div style={{display: 'flex', flexDirection: 'column', paddingTop: 10}}>
        <Typography style={{color: 'black', fontSize: 17, fontWeight: 600, textAlign: 'start'}}>Past Events</Typography>
        <Typography style={{color: 'black', fontSize: 13, fontWeight: 300, textAlign: 'start', paddingRight: 10}}>No Past Event yet.</Typography>
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