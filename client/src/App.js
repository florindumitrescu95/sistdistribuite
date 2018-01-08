import React, { Component } from 'react';
import Chat from './Chat/Chat';
import Registration from './Registration/Registration';
import SendText from './SendText/SendText';

import './App.css';

class App extends Component {
  constructor(props) {
      super(props);

      this.state = {
          joined: false,
          email: '',
          username: '',
          chatContent: ''
      };

      var self = this;
      this.ws = new WebSocket('ws://' + window.location.host + '/ws');

      this.ws.addEventListener('message', function(e) {
          var msg = JSON.parse(e.data);
          self.chatContent += '<div class="chip">'
              + msg.username
              + '</div>' + '<br/>';

          var element = document.getElementById('chat');
          element.scrollTop = element.scrollHeight; // Auto scroll to the bottom
      });
  }

  handleRegistration = (email, username) => {
      if(!email){
          alert("You must enter an email");
          return;
      }
      if(!username){
          alert("You must enter an username");
          return;
      }
      this.setState({ email: email , username: username, joined: true });
  };

  handleSending = (text) => {
      this.ws.send(
          JSON.stringify({
              email: this.email,
              username: this.username,
              message: text// Strip out html
          }
      ));
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <Chat />

          {this.state.joined ?
              <SendText handleSending={this.handleSending} /> :
              <Registration handleRegistration={this.handleRegistration} />
          }
      </div>
    );
  }
}

export default App;
