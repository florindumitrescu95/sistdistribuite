import React, {Component} from 'react';
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
            chatContent: '',
            messages: []
        };
    }

    componentWillMount() {
        var self = this;
        this.ws = new WebSocket('ws://' + window.location.host + '/ws');

        this.ws.addEventListener('open', function (e) {
            console.log('a pornit socket-ul');
        });

        this.ws.onmessage = function (e) {
            console.log(e.data);
        };
        this.ws.onopen = () => this.ws.send('hello');

        this.ws.addEventListener('message', function (e) {
            var msg = JSON.parse(e.data);
            var newState = self.state.messages;
            newState.push(msg);

            self.setState({newState});
        });
    }

    handleSending = (text) => {
        this.ws.send(
            JSON.stringify({
                    email: this.state.email,
                    username: this.state.username,
                    message: text
                }
            ));
    };


    handleRegistration = (email, username) => {
        if (!email) {
            alert("You must enter an email");
            return;
        }
        if (!username) {
            alert("You must enter an username");
            return;
        }
        this.setState({email: email, username: username, joined: true});
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
                <Chat messages={this.state.messages}/>

                {this.state.joined ?
                    <SendText handleSending={this.handleSending}/> :
                    <Registration handleRegistration={this.handleRegistration}/>
                }
            </div>
        );
    }
}

export default App;
