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

  // Check for non-trimmed fields
  
  // Handle non-trimmed fields
  
  // Enforce min & max field lengths
  
  // Confirm username not taken
  
  // Confirm email address not taken
  
  // Sucessful response (for testing)
  return res.status(200).json({message: 'Submission complete'});
  
  
});