'use strict';

const { StoryNetwork } = require('../../storyNetwork');

describe('StoryNetwork mongo model', function() {
  
  it('Should be invalid if `name` is empty', function() {
    let doc = new StoryNetwork({
      isPublic: Math.random() < .5 ? true : false,
      creator: faker.random.uuid()
    });
    
    doc.validate(function(err) {
      expect(err.errors.name).to.exist;
    });
  });
  
  it('Should be invalid if `isPublic` is empty', function() {
    let doc = new StoryNetwork({
      name: faker.random.alphaNumeric(10),
      creator: faker.random.uuid()
    });
    
    doc.validate(function(err) {
      expect(err.errors.isPublic).to.exist;
    });
  });
  
  it('Should be invalid if `creator` is empty', function() {
    let doc = new StoryNetwork({
      name: faker.random.alphaNumeric(10),
      isPublic: Math.random() < .5 ? true : false,
    });
    
    doc.validate(function(err) {
      expect(err.errors.creator).to.exist;
    });
  });
  
  it('Should be valid when all required fields exist', function() {
    let doc = new StoryNetwork({
      name: faker.random.alphaNumeric(10),
      isPublic: Math.random() < .5 ? true : false,
      creator: new mongoose.Types.ObjectId()
    });
    doc.validate(function(err) {
      expect(err).to.not.exist;
    });
  });
});