import React, {Component } from 'react';

export default class SendText extends Component{
    constructor(props) {
        super(props)

        this.state = {
            newMessage: ''
        };

    }

    sendText = () => {
        if(!this.state.newMessage){
            return;
        }

        this.props.handleSending(this.state.newMessage);
        this.setState({ newMessage: ''});
    };

    changeMessage =(event) => {
        this.setState({ newMessage: event.target.value });
    };

    render() {
        const styles = {
            textarea: {
                width: 400,
                height: 100,
                marginRight: 20,
                float: 'left'
            },
            button: {
                width: 80,
                height: 100,
                float: 'right'
            },
            sentText: {
                width: 520,
                margin: '0 auto'
            }
        };

        return(
            <div className='sentText' style={styles.sentText}>
                <textarea style={styles.textarea} onChange={this.changeMessage} />
                <button style={styles.button} onClick={this.sendText} > Send </button>
            </div>
        )
    }
}
