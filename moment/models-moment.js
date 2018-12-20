'use strict';

const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

const momentSchema = mongoose.Schema({});

const Moment = mongoose.model('Moment', momentSchema);

module.exports = {
  Moment
};