'use strict';

// Set up the test environment, including:
  // Loading required modules & variables
  // Running async functions required to start server
  // Creating test database objects for use in various tests
  
// Chai

global.chai = require('chai');
  global.expect = chai.expect;
  global.should = chai.should();
global.chaiHttp = require('chai-http');
  chai.use(chaiHttp);
global.chaiAsPromised = require('chai-as-promised');
  chai.use(chaiAsPromised);
  
// Mongoose
global.mongoose = require('mongoose');
  mongoose.Promise = global.Promise;

// Authorization
global.jwt = require('jsonwebtoken');

// Environment & config variables
require('dotenv').config();
const { app, runServer, closeServer } = require('../server');
  global.app = app;
  global.runServer = runServer;
  global.closeServer = closeServer;
  
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require('../config');
  global.TEST_DATABASE_URL = TEST_DATABASE_URL;
  
// Testing tools
global.faker = require('faker');

// Data model objects
const { User } = require('../user');
const { StoryNetwork } = require('../storyNetwork');
const { Moment } = require('../moment');