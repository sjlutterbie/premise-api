'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { Moment } = require('./models-moment');
const { StoryNetwork } = require('../storyNetwork');

const router = express.Router();

const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false});

// POST: Create a Moment

router.post('/', jsonParser, jwtAuth, (req, res) => {
  
  // FILTER INVALID REQUESTS
  
  // Handle missing fields
  let requiredFields = ['creator', 'storyNetwork', 'content',
                        'isPremiseMoment', 'children'];
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
    let requiredFields = ['lineage', 'premise'];
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
  let {creator, storyNetwork, content, isPremiseMoment} = req.body;
  let premise = req.body.premise || null;
  let children = req.body.children || [];
  let lineage = req.body.lineage || [];
  
  // Create moment
  return Moment.create({creator, storyNetwork, content, isPremiseMoment,
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

router.get('/storychain', jsonParser, jwtAuth, (req, res) => {
  
  const startMoment = req.query.start;
  const endMoment = req.query.end;
  
  // Get END moment first
  
  Moment.findById(endMoment)
    .then(function(moment) {
      
      // Convert _ids to strings
      const strLineage = moment.lineage.map(String);
      
      // Confirm startMoment is within moment's lineage
      if(!strLineage.includes(startMoment)) {
        throw('startMoment not in endMoment lineage');
      } else {
        
        // Create a subset of from startMoment to endMoment
        const momentSet = moment.lineage.slice(
                            strLineage.indexOf(startMoment),
                            moment.lineage.length);
        return Moment.find({
          _id: { $in: momentSet}
        }).exec();
      }
    })
    .then(function(storyChain) {
      
      // Serialize moments
      for (let i = 0; i < storyChain.length; i++) {
        storyChain[i] = storyChain[i].serialize();
      }
      
      return res.status(201).json(storyChain);
    })
    .catch(function(err) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Invalid Id pairing'
      });
    });
});

router.get('/storynetwork/:id', jsonParser, jwtAuth, (req, res) => {
  
  // Check for valid storyNetwork
  StoryNetwork.findById(req.params.id)
    .then(function(storyNetwork) {
      
      // Convert string to ObjectId
      const storyNetworkId = mongoose.Types.ObjectId(req.params.id);

      return Moment.find({
        storyNetwork: storyNetworkId
      }).exec();
    })
    .then(function(moments) {
      // Serialize each moment
      for(let i = 0; i < moments.length; i++) {
        moments[i] = moments[i].serialize();
      }
      return res.status(201).json(moments);
    })
    .catch(function(err) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Invalid storyNetwork Id'
      });
    });
});

router.get('/storynetwork/:id/max-lineage', jsonParser, jwtAuth, (req, res) => {
  
  Moment.find({storyNetwork: req.params.id}).populate('lineage').exec()
    .then(function(moments) {
      // Serialize, to attach lineageLength
      for(let i = 0; i < moments.length; i++) {
        moments[i] = moments[i].serialize();
      }
      
      // Select the item with the longest lineageLength
      let output = {lineageLength: 0};
      
      for(let i = 0; i < moments.length; i++) {
        if (moments[i].lineageLength > output.lineageLength) {
          output = moments[i];
        }
      }
      
      // Return the first result (handles tie for longest lineageLength)
      return res.status(201).json(output);
    })
    .catch(function(err) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Invalid storyNetwork'
      });
    });

});

 
router.get('/:id', jsonParser, jwtAuth, (req, res) => {
  
  Moment.findById(req.params.id).populate('lineage')
    .then(function(moment) {
      res.status(200).json(moment);
    })
    .catch(function(err) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Invalid moment Id'
      });
    });

});

module.exports = { router };