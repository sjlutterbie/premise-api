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

storyNetworkSchema.methods.serialize = function() {
  return {
    name: this.name,
    isPublic: this.isPublic,
    creator: this.creator,
    id: this._id
  };
};

const StoryNetwork = mongoose.model('StoryNetwork', storyNetworkSchema);

module.exports = {
  StoryNetwork
};