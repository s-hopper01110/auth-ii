import React from 'react';
import axios from 'axios';


axios.defaults.baseURL = 'http:localhost:3000/api';

axios.interceptors.request.use(
   function(options) {

       options.headers.authorization = localStorage.getItem('jwt')

       return options;
   },
   function(error) {
       return Promise.reject(error)
   }
);

//HIGHER ORDER COMPONENT
export default function(Component){
  return class Authenticated extends React.Component {
      render() {

        const token = localStorage.getItem('jwt')
        const notLoggedIn = <div>Please Log in to see the users</div>
          return (
              <div>
{token ? <Component {...this.props} /> : notLoggedIn}
              </div>
          )
      }
  }
}