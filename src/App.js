import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';
import './App.css';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/' component={Home} exact={true} />
        <Route path='/chatroom/:id' component={ChatRoom} />
      </Switch>
    );
  }
}

export default App;