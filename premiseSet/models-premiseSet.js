'use strict';

const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  
const premiseSetSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const PremiseSet = mongoose.model('PremiseSet', premiseSetSchema);

module.exports = {
  PremiseSet
};