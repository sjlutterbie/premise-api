'use strict';

const { User, EndpointsObject } = require('../../user');

describe('User schema', function() {
  
  let testUser;
  
  beforeEach(() => {
    // Build a complete User for testing
    testUser = {
      username: faker.random.alphaNumeric(10),
      password: faker.random.alphaNumeric(10),
      firstName: faker.random.alphaNumeric(10),
      lirstName: faker.random.alphaNumeric(10),
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
  
  it('Should validate if all fields exist', function() {
    let doc = new User(testUser);
    doc.validate(function(err) {
      expect(err).to.not.exist;
    });
  });

  describe('EndpointsObject sub-schema', function() {
    
    let testObj;
    
    beforeEach(function() {
      testObj = {
        storyNetwork: new mongoose.Types.ObjectId(),
        endpoints: [
          new mongoose.Types.ObjectId(),
          new mongoose.Types.ObjectId()
        ]
      };
    });
    
    it('Should be invalid if `storyNetwork` is empty', function() {
      delete testObj.storyNetwork;
      let doc = new EndpointsObject(testObj);
      doc.validate(function(err) {
        expect(err.errors.storyNetwork).to.exist;
      });
    });
    
    it('Should be valid if all fields exist', function() {
      let doc = new EndpointsObject(testObj);
      doc.validate(function(err) {
        expect(err).to.not.exist;
      });
    });
  });
});