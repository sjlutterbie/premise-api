'use strict';

const chai = require('chai');
  const expect = chai.expect;
  const should = chai.should();
  
const faker = require('faker');

const mongoose = require('mongoose');

const { User } = require('../user');

describe('User mongo model', function() {
  
  let testUser;
  
  beforeEach(() => {
    // Build a complete User for testing
    testUser = {
      username: faker.random.alphaNumeric(10),
      password: faker.random.alphaNumeric(10),
      name: {
        fName: faker.random.alphaNumeric(10),
        lName: faker.random.alphaNumeric(10)
      },
      email: faker.internet.email(),
      storyNetworks: [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
      ],
      endpoints: {
        1: [new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
           ],
        2: [new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId()
           ]
      }
    };
  });
  
  it('Should be invalid if `username` is empty', function() {
    delete testUser.username;
    let doc = new User(testUser);
    doc.validate(function(err) {
      expect(err.errors.username).to.exist;
    });
  });
  
  it('Should be invalid if `password` is empty', function() {
    delete testUser.password;
    let doc = new User(testUser);
    doc.validate(function(err) {
      expect(err.errors.password).to.exist;
    });
  });
  
  
});