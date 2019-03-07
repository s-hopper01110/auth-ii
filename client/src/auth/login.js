import axios from 'axios'

import React, { Component } from 'react'

export default class Login extends Component {
    state = {
        username: '',
        password: ''
    }
render() {
    return (
        <div>
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
            <label htmlFor='username' />
                <input name="username" 
                id="username" 
                value={this.state.username}
                type='text'
                onChange={this.handleInput}
                />
            <label htmlFor='password'/>
            <input 
            name='password'
            id='password'
            value={this.state.password}
            type='password'
            onChange={this.handleInput}
            />
            <button type='submit'>Login</button>
           
        </form>
        </div>
    )
}

handleInput = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
}
handleSubmit = e => {
    e.preventDefault()
    const endpoint = 'http://localhost:5003/api/login';

    axios.post(endpoint, this.state)
    .then(res => {
        localStorage.setItem('jwt', res.data.token);
    })
    .catch(error => console.log(error))
}
}


