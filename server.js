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


////////// LOGIN:

  //| POST   | /api/login    | Use the credentials sent inside the `body` to authenticate the user. On successful login, create a new JWT with the user id as the subject and send it back to the client. If login fails, respond with the correct status code and the message: 'You shall not pass!' 
  
  function generateToken(user) { 
    const payload = {
        subject: user.id, // sub in payload is what the token is about 
        username: user.username,
        //..other data would be implemented here  .... secret stays out of this function 
    }

    const options = {
        expiresIn: '1d'
    }
   
    return jwt.sign(payload, secret, options)
}


server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
  
    Users.findBy({ username })
      .first()
      .then(user => {
        // check that passwords match
        if (user && bcrypt.compareSync(password, user.password)) {
         const token = generateToken(user) // produces  a token 
          //return token 
          res
            .status(200)
            .json({ message: `Welcome ${user.username}!, have a token...`, token, }); //(token implemented sends token to the client)
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  function restricted(req, res, next) {
    const token = req.headers.authorization
        if(token) {
           jwt.verify(token, secret, (err, decodedToken) => {
               if(err) {
               //record the event    
               res.status(401).json({ message: ' Nice Try!'}) 
               } else { 
                  next();       
               }
           })
        } else {
            res.status(401).json({ message: 'You shall not pass! '})
          }
    }

  //GET USERS: 
  //| GET    | /api/users    | If the user is logged in, respond with an array of all the users contained in the database. If the user is not logged in respond with the correct status code and the message: 'You shall not pass!'. Use this endpoint to verify that the password is hashed before it is saved. |


  server.get('/api/users', restricted, (req, res) => {
    Users.find()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });
  
  server.get('/users', restricted, async (req, res) => {
    try {
      const users = await Users.find();
  
      res.json(users);
    } catch (error) {
      res.send(error);
    }
  });



module.exports = server; 