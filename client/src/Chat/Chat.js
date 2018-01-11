import React, { Component } from 'react';

import './Chat.css';

export default class Chat extends Component{
    renderMessages = (messages) => {
      return messages.map(({ email, username, message}) => (
          <div>
              <span>Username: {username}</span>
              <p>{message}</p>
          </div>
      ));
    };

    render() {
        const { messages } = this.props;

        return(
            <div className='chatWrapper'>
                <div className='chat'  >
                    {this.renderMessages(messages)}
                </div>
            </div>
        )
    }
}
