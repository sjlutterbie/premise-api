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

userSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    email: this.email || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    id: this._id
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

// Created for testing purposes only
const EndpointsObject = mongoose.model('EndPointObject', endpointsObject);

module.exports = {
  User, EndpointsObject
};