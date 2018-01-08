import React, {Component } from 'react';

export default class Registration extends Component{
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            username: ''
        }
    }

    handleChangeUsername = (event) => {
        this.setState({ username: event.target.value });
    };

    handleChangeEmail = (event) => {
        this.setState({ email : event.target.value })
    };

    render() {
        const { handleRegistration } = this.props;
        const { email , username } = this.state;

        return(
            <div className='registration'>
                <input type='text' placeholder='Username' onChange={(event) => this.handleChangeUsername(event)}/>
                <input type='text' placeholder='Email' onChange={(event) => this.handleChangeEmail(event)} />
                <button onClick={() => handleRegistration(email, username)} > Apasa </button>
            </div>
        )
    }
}