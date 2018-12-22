'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Moment } = require('./models-moment');

const router = express.Router();

const jsonParser = bodyParser.json();

// POST: Create a Moment

router.post('/', jsonParser, (req, res) => {
  
  // FILTER INVALID REQUESTS
  
  // Handle missing fields
  let requiredFields = ['creator', 'content', 'isPremiseMoment', 'children'];
  let missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }
  
  // Handle requests where isPremiseMoment === false, but don't have
    // `lineage` nor `premise` fields
  
  if(!req.body.isPremiseMoment) {
    let requiredFields = ['lienage', 'premise'];
    let missingField = requiredFields.find(field => !(field in req.body));
    if (missingField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      });
    }
  }


  // Handle fields that should be strings
  let stringFields = ['content'];
  let nonStringField = stringFields.find(field => 
    (typeof req.body[field] != 'string')
  );
  
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Non-string field',
      location: nonStringField
    });
  }
  
  // Reject requests where content.length > 200
  if(req.body.content.length > 200) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Moment is too long',
      location: 'moment'
    });
  }

  // Handle fields that should be booleans
  let booleanFields = ['isPremiseMoment'];
  let nonBooleanField = booleanFields.find(field => 
    typeof req.body[field] != 'boolean'
  );
  
  if (nonBooleanField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Non-boolean field',
      location: nonBooleanField
    });
  }

  // ACCEPT VALID REQUEST
  
  // Store variables
  let {creator, content, isPremiseMoment} = req.body;
  let premise = req.body.premise || null;
  let children = req.body.children || [];
  let lineage = req.body.lineage || [];
  
  // Create moment
  return Moment.create({creator, content, isPremiseMoment,
                        premise, lineage,children})
    //After creation, append _id to lineages[0]
    .then( moment => {
      
      let lineage = moment.lineage || [];
      lineage.push(moment.id);

      return Moment.findByIdAndUpdate(moment.id,
        {
          lineage
        }, {new: true}).exec();
    })
    .then( moment => {
      return res.status(201).json(moment.serialize());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      // Keep non-validation errors private
      res.status(500).json(err); //{code: 500, message: 'Internal server error'});
    });

  // After creation, append the _id to lineages

});

module.exports = { router };