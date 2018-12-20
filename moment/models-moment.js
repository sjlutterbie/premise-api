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
  },
  isPremiseMoment: {
    type: Boolean,
    required: true
  },
  premise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Moment',
    required: !this.isPremiseMoment
  },
  lineages: {
    type: [
      [mongoose.Schema.Types.ObjectId]
    ],
    required: !this.isPremiseMoment,
    validate: v => v.length > 0,
    // Mongoose defaults to empty array, breaking 'required' validation, so:
    default: undefined
  },
  children: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    // Mongoose defaults to empty array, breaking 'required' validation, so:
    default: undefined
  }
});

const Moment = mongoose.model('Moment', momentSchema);

module.exports = {
  Moment
};