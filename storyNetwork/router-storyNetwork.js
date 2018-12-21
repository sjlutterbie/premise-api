'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { StoryNetwork } = require('./models-storyNetwork');

const router = express.Router();

const jsonParser = bodyParser.json();

// POST: Create new Story Network

router.post('/', jsonParser, (req, res) => {
  
  // Check for missing fields
  const requiredFields = ['name', 'isPublic', 'creator'];
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

  // Store variables
  let {name, isPublic, creator } = req.body;
  
  // Create StoryNetwork
  return StoryNetwork.create({name,isPublic,creator})
    .then( storyNetwork => {
      return res.status(201).json(storyNetwork.serialize());
    })
    .catch(err => {
      if(err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      // Keep non-validation errors private
      res.status(500).json({code: 500, message: 'Internal server error'});
    });

});

module.exports = {router};