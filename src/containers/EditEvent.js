import React, { Component } from "react";
import { connect } from "react-redux";

import { firebaseDb } from "../config/firebase.js";
import { TextField, Card, Button } from "@material-ui/core";

class EditEvent extends Component {
  state = {
    title: "",
    venue: "",
    details: "",
    date: "",
    edit: false
  };



  componentDidMount() {
    if (this.props.location.state) {
      this.setState({ ...this.props.location.state, edit: true })
    }
  }

  onInputChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onFormSubmit = e => {
    e.preventDefault();

    const id = this.state.eventId || firebaseDb.ref("events/").push().key;
    const chatRoomId = this.props.match.params.id
    const dateObj = new Date(this.state.date)
    const sortDate = dateObj.getTime()
    const dateString = dateObj.toLocaleString('en-us', { month: 'short', day: 'numeric' });
    const { title, venue, details, date } = this.state

    firebaseDb
      .ref("events/" + chatRoomId + "/" + id)
      .set({
        id: id,
        sortDate,
        title,
        venue,
        details,
        date,
        dateString
      })
      .then(() => {
        this.props.history.push(`/chatroom/${chatRoomId}`)
      });
  };

  render() {
    return (
      <div style={{ width: "100%", paddingTop: 80 }}>
        <Card style={{ margin: "auto", width: 600, padding: 20 }}>
          <form
            style={{ display: "flex", flexDirection: "column" }}
            onSubmit={this.onFormSubmit}
          >
            <TextField
              id="date"
              name="date"
              label="Date"
              type="date"
              value={this.state.date}
              InputLabelProps={{
                shrink: true
              }}
              onChange={this.onInputChange}
              required
            />
            <TextField
              name="title"
              label="Event Title"
              value={this.state.title}
              onChange={this.onInputChange}
              required
            />
            <TextField
              name="venue"
              label="Venue"
              value={this.state.venue}
              onChange={this.onInputChange}
              required
            />
            <TextField
              name="details"
              label="Details"
              value={this.state.details}
              onChange={this.onInputChange}
              rows={4}
              multiline
              fullWidth
            />
            {
              this.state.edit
                ?
                <Button color="secondary" variant="contained" type="submit">
                  Save Changes
            </Button>
                :
                <Button color="primary" variant="contained" type="submit">
                  Add Event
            </Button>
            }
          </form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.users
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditEvent);