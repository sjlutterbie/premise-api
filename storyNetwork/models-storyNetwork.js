'use strict';

const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  
const storyNetworkSchema = mongoose.Schema({
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

const StoryNetwork = mongoose.model('StoryNetwork', storyNetworkSchema);

module.exports = {
  StoryNetwork
};