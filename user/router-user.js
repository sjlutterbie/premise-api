'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { User } = require('./models-user');

const router = express.Router();

const jsonParser = bodyParser.json();

module.exports = {router};

// POST: Register new user
router.post('/', jsonParser, (req, res) => {
  
  // Check for missing fields
  const requiredFields = ['username', 'password', 'email'];
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
    },
    email: {
      min: 1
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
          + 'characters long'
    });
  }

  // Confirm username not taken
  
  // Confirm email address not taken
  
  // Sucessful response (for testing)
  return res.status(200).json({message: 'Submission complete'});
  
  
});