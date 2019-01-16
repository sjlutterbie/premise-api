'use strict';

const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

const momentSchema = mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storyNetwork: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoryNetwork',
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
  lineage: {
    type: [mongoose.Schema.Types.ObjectId],
    required: function() { return !this.isPremiseMoment},
    validate: function(lineage) {
      return (this.isPremiseMoment || lineage.length > 0); 
    },
    // Mongoose defaults to empty array, breaking 'required' validation, so:
    default: undefined
  },
  children: {
    type: [mongoose.Schema.Types.ObjectId]
  }
});

momentSchema.virtual('lineageLength').get(function() {
  return this.lineage.length;
});

momentSchema.methods.serialize = function() {
  return {
    creator: this.creator,
    storyNetwork: this.storyNetwork,
    content: this.content,
    isPremiseMoment: this.isPremiseMoment,
    premise: this.premise || null,
    lineage: this.lineage || [],
    lineageLength: this.lineageLength,
    children: this.children || [],
    id: this._id
  };
};

const Moment = mongoose.model('Moment', momentSchema);

module.exports = {
  Moment
};