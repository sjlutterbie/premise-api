'use strict';

const { Moment } = require('../../moment');

describe('Moment schema', function() {
  
  let testMoment;
  
  beforeEach(function() {
    // Build a complete Moment for testing
    testMoment = {
      creator: new mongoose.Types.ObjectId(),
      storyNetwork: new mongoose.Types.ObjectId(),
      content: faker.lorem.sentences(5),
      premise: new mongoose.Types.ObjectId(),
      isPremiseMoment: false,
      lineage: [
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()
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
  
  it('Should be inavlid if `storyNetwork` is empty', function() {
    delete testMoment.storyNetwork;
    let doc = new Moment(testMoment);
    doc.validate(function(err) {
      expect(err.errors.storyNetwork).to.exist;
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
    let doc = new Moment(testMoment);
    doc.validate(function(err) {
      expect(err.errors.content).to.exist;
    });
  });
  
  it('Should be invalid if `isPremiseMoment` is empty', function() {
    delete testMoment.isPremiseMoment;
    let doc = new Moment(testMoment);
    doc.validate(function(err) {
      expect(err.errors.isPremiseMoment).to.exist;
    });
  });
  
  it('Should be invalid if `isPremiseMoment === false` '
     + '&& `premise` is empty',function() {
    testMoment.isPremiseMoment = false;
    delete testMoment.premise;
    let doc = new Moment(testMoment);
    doc.validate(function(err) {
      expect(err.errors.premise).to.exist;
    });
  });
  
  it('Should be invalid if `isPremiseMoment === false` '
     + ' && lineage` is empty', function() {
    testMoment.isPremiseMoment = false;
    delete testMoment.lineage;
    let doc = new Moment(testMoment);
    doc.validate(function(err) {
      expect(err.errors.lineage).to.exist;
    });
  });
  
  it('Should be invalid if `isPremiseMoment` is false'
     + '&& `lineage.length === 0`', function() {
    testMoment.isPremiseMoment = false;
    testMoment.lineage = [];
    let doc = new Moment(testMoment);
    doc.validate(function(err){
      expect(err.errors.lineage).to.exist;
    });
  });
});