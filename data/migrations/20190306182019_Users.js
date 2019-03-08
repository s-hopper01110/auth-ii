
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', users => {
        users.increments();
    
        users
          .string('username', 128)
          .notNullable()
          .unique();
        users.string('password', 128).notNullable();
        users.string('department', 128)
      });
};


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




exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
