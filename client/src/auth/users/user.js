import React, { Component } from 'react'
import axios from 'axios'
import requiresAuth from '../requiresAuth';

 class Users extends React.Component {
    state = {
        users: [],
    }
    render() {
        return (
            <div>
                <h2>List of Users</h2>
                <ul>
                    {this.state.users.map(u => (
                        <li key={u.id}>{u.username}</li>
                    ))}
                </ul>
            </div>
        )
    }

    componentDidMount() {
        axios.get('/users').then(res => {
            this.setState({ users: res.data })
        })
    }


}export default requiresAuth(Users) 