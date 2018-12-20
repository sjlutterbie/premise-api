'use strict';

const chai = require('chai');
  const expect = chai.expect;
  const should = chai.should();
  
const faker = require('faker');

const mongoose = require('mongoose');

const { Moment } = require('../moment');

describe('Moment schema', function() {
  
  let testMoment;
  
  beforeEach(function() {
    // Build a complete Moment for testing
    testMoment = {
      creator: new mongoose.Types.ObjectId(),
      content: faker.lorem.sentences(5),
      premise: new mongoose.Types.ObjectId(),
      isPremiseMoment: Math.random() < .5 ? true : false,
      lineages: [
        [
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId()
        ],
        [
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId()
        ]
      ],
      children: [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
      ]
    };
  });
  
  it('Should be invalid if `creator` is empty', function() {
    delete testMoment.creator;
    let doc = new Moment(testMoment);
    doc.validate(function(err) {
      expect(err.errors.creator).to.exist;
    });
  });
  
  it('Should be invalid if `content` is empty', function() {
    delete testMoment.content;
    let doc = new Moment(testMoment);
    doc.validate(function(err) {
      expect(err.errors.content).to.exist;
    });
  });
  
  it('Should be invalid if `content.length > 200', function() {
    testMoment.content = faker.random.alphaNumeric(201);
    console.log(testMoment);
    let doc = new Moment(testMoment);
    doc.validate(function(err) {
      expect(err.errors.content).to.exist;
    });
  });

});