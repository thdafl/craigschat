import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const ChatRoomEvents = () => {
  return (
    <div>
      <div style={{padding: 5}}><Button size='small' variant="outlined" color="primary">Create a Event</Button></div>
      <div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 1 - Greetings @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 3 - Weekly Mtg @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 14 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 17 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 20 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 25 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 25 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 25 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 25 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 25 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 25 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 25 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 25 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 25 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 25 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 25 - Weekly Mtg  @CreatersCafe</div>
        <div style={{display: 'flex', fontSize: 15, fontWeight: 100, padding:5}}>Nov. 25 - Weekly Mtg  @CreatersCafe</div>
      </div>
    </div>
  )
}

const styles = theme => ({
  example: {
    width: '95%'
  }
});

export default withStyles(styles)(ChatRoomEvents);
