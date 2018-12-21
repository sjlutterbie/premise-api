'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Moment } = require('./models-moment');

const router = express.Router();

const jsonParser = bodyParser.json();

// POST: Create a Moment

router.post('/', jsonParser, (req, res) => {
  
  // DEV ONLY: Default to success response for testing
  return res.status(200).json({code: 200, message: 'Request received'});
  
});

module.exports = { router };