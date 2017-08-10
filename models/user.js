const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/customers_db');

let db = mongoose.connection;


///User Schma
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name : {
    type: String
  },
  profileimage : {
    type: String
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback) {
  let query = {username: username};
  User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePasword, hash, callback){
  bcrypt.compare(candidatePasword, hash, function(err,isMatch) {
    console.log('candidatePasword',candidatePasword);
    console.log('Hasd',hash);
    console.log('Match', isMatch);
   callback(null, isMatch);
});
}

module.exports.creatUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
});
}
