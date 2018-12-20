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
  
  function buildMoment(isPremiseMoment = false) {
    return {
      content: faker.random.alphaNumeric(100),
      isPremiseMoment: isPremiseMoment,
      lineages: [],
      children: []
    };
  }
  
  global.premiseMoment = {
    content: faker.random.alphaNumeric(100),
    isPremiseMoment: true
  };
  
  global.testMoment = {
    content: faker.lorem.sentences(5),
    isPremiseMoment: false
  };


// TODO: REACTIVATE AND COMPLETE THE FOLLOWING CODE

  
  // Build objects in testDb
  return runServer(TEST_DATABASE_URL)
    .then(function(res) {
      return User.create(
        {
          username: testUser.username,
          password: testUser.password,
          email: testUser.email
        }  
      );
    }).then(function(user) {
      testIds.userId = user._id;
      return StoryNetwork.create(
        {
          name: testStoryNetwork.name,
          isPublic: testStoryNetwork.isPublic,
          creator: testIds.userId
        }  
      );
    }).then(function(storyNetwork) {
      testIds.storyNetwork = storyNetwork._id;
      // Create 'premise Moment'
      console.log('Creating premise Moment...');
      const tempMoment = buildMoment(true);
      return Moment.create(
        {
          creator: testIds.userId,
          content: tempMoment.content,
          isPremiseMoment: tempMoment.isPremiseMoment,
          children: []
        }
      );
    }).then(function(newPremiseMoment) {
      testIds.premiseMoment = newPremiseMoment._id;
      // Create 'regular' moment
      console.log('Creating a regular moment...')
      const tempMoment = buildMoment();
      return Moment.create(
        {
          creator: testIds.userId,
          content: tempMoment.content,
          isPremiseMoment: tempMoment.isPremiseMoment,
          premise: testIds.premiseMoment,
          lineages: [testIds.premiseMoment],
          children: []
        }
      );
    }).then(function(newMoment) {
      testIds.regularMoment = newMoment._id;
      return Moment.findByIdAndUpdate(testIds.premiseMoment,
        {
          children: [testIds.regularMoment]
        }
      ).exec();
    }).then(function(res) {
      console.log('Data objects created successfully');
      return;
    }).catch(function(err) {
      console.log(err);
      return err;
    });
});

after( function() {
  
  console.log('Deleting data items...');
  
  const userProm = User.deleteMany({}).exec();
  const storyNetworkProm = StoryNetwork.deleteMany({}).exec();
  const momentProm = Moment.deleteMany({}).exec();
  
  // IS THIS ACTUALLY EXECUTING?
  
  Promise.all([userProm, storyNetworkProm, momentProm])
    .then(function(res) {
      console.log('Test data successfully removed');
      return closeServer();
    });
});