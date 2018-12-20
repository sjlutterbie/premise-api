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

const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require('../config');
  global.TEST_DATABASE_URL = TEST_DATABASE_URL;
  
// Testing tools
global.faker = require('faker');

// Data model objects
const { User } = require('../user');
const { StoryNetwork } = require('../storyNetwork');
const { Moment } = require('../moment');

// Server setup and data object creation
before(function() {
  
  // Testing constants
  global.token = jwt.sign(
    {
      user: faker.random.alphaNumeric(10)
    },
    JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '1d'
    }
  );
  
  global.expiredToken = jwt.sign(
    {
      user: faker.random.alphaNumeric(10),
      exp: (Math.floor(Date.now()/1000) - 10) // Expired 10 seconds ago
    },
    JWT_SECRET,
    {
      algorithm: 'HS256'
    }
  );
  
  global.testIds = {};
  
  global.testUser = {
   username: faker.random.alphaNumeric(10),
   password: faker.random.alphaNumeric(10),
   email: faker.internet.email()
  };
  
  global.testStoryNetwork = {
    name: faker.random.alphaNumeric(10),
    isPublic: Math.random() < .5 ? true : false
  };
  
  global.testMoment = {
    content: faker.lorem.sentences(5),
    isPremiseMoment: false
  };
  
});