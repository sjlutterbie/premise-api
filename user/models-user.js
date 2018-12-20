'use strict';

const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  
const bcrypt = require('bcryptjs');  
  
// Helper Schemas

const endpointsObject = new mongoose.Schema({
  storyNetwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoryNetwork',
    required: true
  },
  endpoints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Moment'
  }]
});
  
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String},
  lastName: {type: String},
  email: {
    type: String,
    required: true
  },
  storyNetworks: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StoryNetwork'
    }]
  },
  endpointsList: [endpointsObject]
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

// Created for testing purposes only
const EndpointsObject = mongoose.model('EndPointObject', endpointsObject);

module.exports = {
  User, EndpointsObject
};