const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const db = require('./data/dbConfig.js');
const Users = require('./users/users-model.js');

const secret = 'Naruto'


const server = express();


server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send("It's alive!");
  });



//| POST   | /api/register 
//| Creates a `user` using the information sent inside the `body` of the request. 
//**Hash the password** before saving the user to the database. 

server.post('/api/register', (req, res) => {
    let user = req.body;
  
    const hash = bcrypt.hashSync(user.password, 16) // generates hash for user password
    user.password = hash // override user with hash
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });



module.exports = server; 