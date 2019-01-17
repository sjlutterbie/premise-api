'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { User } = require('./models-user');

const router = express.Router();

const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false});

// POST: Register new user

router.post('/', jsonParser, (req, res) => {
  
  // Check for missing fields
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
  
  // Handle missing fields
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
  
  // Check for non-string fields (primary level)
  const stringFields = ['username', 'password', 'email',
                        'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] != 'string'
    );

  // Handle non-string fields
  if (nonStringField){
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Non-string field',
      location: nonStringField
    });
  }

  // Check for non-trimmed  (username, password, email)
  const trimmedFields = ['username', 'password', 'email'];
  const nonTrimmedField = trimmedFields.find(
    field => field in req.body && req.body[field] != req.body[field].trim()
  );
  
  // Handle non-trimmed fields
  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: `${nonTrimmedField} cannot start or end with whitespace`,
      location: nonTrimmedField
    });
  }
  
  // Enforce min & max field lengths
  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      max: 71
    }
  };
  
  const tooSmallField = Object.keys(sizedFields).find(
    field => 
    'min' in sizedFields[field] &&
    req.body[field].trim().length < sizedFields[field].min
  );
  
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
    'max' in sizedFields[field] &&
    req.body[field].trim().length > sizedFields[field].max
  );
  
  if(tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Password must be at least ${sizedFields[tooSmallField].min} `
          + 'characters long' :
          `Password must be at most ${sizedFields[tooLargeField].max} `
          + 'characters long',
      location: (tooSmallField || tooLargeField)
    });
  }
  
  // Store variables
  let {username, password, email = '', firstName = '', lastName = ''} = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim();
    // NOTE: username & password already trimmed
    
  // Check username & email not taken; if not, create user
  return User.find({$or:[{username}]})
    .count()
    .then(count => {
      if( count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
      .then(hash => {
        return User.create({
          username,
          password: hash,
          email,
          firstName,
          lastName
        });
      })
      .then( user => {
        return res.status(201).json(user.serialize());
      })
      .catch( err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
        }
        // Keep non-validation errors private
        res.status(500).json({code: 500, message: 'Internal server error'});
      });
});

// GET: User by userId

router.get('/:id', jsonParser, jwtAuth, (req, res) => {
  
  User.findById(req.params.id).exec()
    .then(function(user) {
      return res.status(200).json(user);
    })
    .catch(function(err) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Invalid userId'
      });
    });
});

// GET: User by username

router.get('/username/:username', jsonParser, jwtAuth, (req, res) => {
  
  User.find({username: req.params.username}).exec()
    .then(function(user) {
      if(user.length === 0) {
          return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Could not find username'
          });
      }
      return res.status(200).json(user[0].serialize());
    })
    .catch(function(err) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Invalid request'
      });
    });
  

});


module.exports = {router};
