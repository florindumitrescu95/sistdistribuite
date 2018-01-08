import React, {Component } from 'react';

export default class Chat extends Component{
    constructor(props) {
        super(props)
    }

    render() {
    const styles = {
        chatWrapper: {
            width: 500,
            height: 500,
            border: '1px solid black',
            margin: '0 auto',
            marginBottom: 10
        },
        chat: {
            overflowY: 'scroll'
        }
    };
        return(
            <div className='chatWrapper' style={styles.chatWrapper}>
                <div className='chat' style={styles.chat}  />
            </div>
        )
    }
}