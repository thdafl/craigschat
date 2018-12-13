import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import ChatRoom from './containers/ChatRoom';
import CreateChatRoom from './containers/CreateChatRoom'
import './App.css';

ReactGA.initialize('UA-130530759-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/' component={Home} exact={true} />
        <Route path='/chatroom/:id' component={ChatRoom} />
        <Route path="/new/chatroom" component={CreateChatRoom}/>
      </Switch>
    );
  }
}

export default App;
