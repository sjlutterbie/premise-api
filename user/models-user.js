'use strict';

const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  
const bcrypt = require('bcryptjs');  
  
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
  
  // username: string required
  // password: string required (bcrypt)
  // name: object
    // fName: string
    // lName: string
  // email: string required
  // storyNetworks: array [mongo refs: storyNetworks] required
  // endpoints: object required
    // {storyNetwork_id: [mongo refs to Moment]
  
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = {
  User
};