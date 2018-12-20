'use strict';

const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

const momentSchema = mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  }
  
  
  
/*
creator: ref to User._id REQ
content: string REQ
premise: ref to Premise._id REQ
isPremiseMoment: boolean REQ
lineages: array of arrays REQ
  a lineage: array [refs to Moment._id]
children: array [refs to Moment._id]
*/
  
});

const Moment = mongoose.model('Moment', momentSchema);

module.exports = {
  Moment
};



