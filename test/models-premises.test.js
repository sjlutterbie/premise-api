'use strict';

const chai = require('chai');
  const expect = chai.expect;
  const should = chai.should();

const faker = require('faker');

const mongoose = require('mongoose');

const { PremiseSet } = require('../premiseSet');

describe('premiseSet', function() {
  
  it('Should be invalid if `name` is empty', function() {
    let doc = new PremiseSet({
      isPublic: Math.random() < .5 ? true : false,
      creator: faker.random.uuid()
    });
    
    doc.validate(function(err) {
      expect(err.errors).to.exist;
    });
  });
  
  it('Should be invalid if `isPublic` is empty', function() {
    let doc = new PremiseSet({
      name: faker.random.alphaNumeric(10),
      creator: faker.random.uuid()
    });
    
    doc.validate(function(err) {
      expect(err.errors).to.exist;
    });
  });
  
  it('Should be invalid if `creator` is empty', function() {
    let doc = new PremiseSet({
      name: faker.random.alphaNumeric(10),
      isPublic: Math.random() < .5 ? true : false,
    });
    
    doc.validate(function(err) {
      expect(err.errors).to.exist;
    });
  });
  
  it('Should be valid when all required fields exist', function() {
    let doc = new PremiseSet({
      name: faker.random.alphaNumeric(10),
      isPublic: Math.random() < .5 ? true : false,
      creator: new mongoose.Types.ObjectId()
    });
    doc.validate(function(err) {
      expect(err).to.not.exist;
    });
  });
});