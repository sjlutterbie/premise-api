'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());

// When the user provides a username & password to login
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());

  res.json({
    authToken: authToken,
    user: req.user.serialize(),
    userType: 'individual' // For 'buildPortal(profTYpe, profID)'
  });
  
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// When the user exchanges a valid JWT for a newer one
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});

router.get('/test', jwtAuth, (req, res) => {
  // Route for unit testing JWT authentication middleware
  res.status(200).json({message: 'Authentication successful'});
});


module.exports = {router};