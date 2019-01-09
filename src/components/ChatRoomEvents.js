import React from 'react';
import Button from "@material-ui/core/Button";
import { withStyles } from '@material-ui/core/styles';

const ChatRoomEvents = React.memo(({ editable, events, onDelete, onUpdate }) => {
  return (
    <div style={{ paddingLeft: 15 }}>
      <h2 style={{ textAlign: 'left' }}>Scheduled Events</h2>
      <div>
        {events.map((event, ind) => {
          return <div key={ind} style={styles.eventListing}><div>{event.dateString} - {event.title} @{event.venue}</div>
            {editable && <div>
              <Button style={{ color: 'orange' }}
                onClick={() => onUpdate(event)}
              >
                update
              </Button>
              <Button style={{ color: 'red' }}
                onClick={() => onDelete(event.eventId)}
              >
                delete
              </Button>
            </div>}
          </div>;
        })}
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