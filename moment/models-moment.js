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
    required: function() { return !this.isPremiseMoment}
  },
  lineages: {
    type: [
      [mongoose.Schema.Types.ObjectId]
    ],
    required: function() { return !this.isPremiseMoment},
    validate: function(lineages) {
      return (this.isPremiseMoment || lineages.length > 0); 
    },
    // Mongoose defaults to empty array, breaking 'required' validation, so:
    default: undefined
  },
  children: {
    type: [mongoose.Schema.Types.ObjectId]
  }
});

momentSchema.methods.serialize = function() {
  return {
    creator: this.creator,
    content: this.content,
    isPremiseMoment: this.isPremiseMoment,
    premise: this.premise || null,
    lineages: this.lineages || [],
    children: this.children || [],
    id: this._id
  };
};

const Moment = mongoose.model('Moment', momentSchema);

module.exports = {
  Moment
};