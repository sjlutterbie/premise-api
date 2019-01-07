'use strict';

const {router: storyNetworkRouter } = require('../../storyNetwork');

describe('StoryNetwork Router', function() {
  
  it('Should be defined', function() {
    expect(storyNetworkRouter).to.exist;
  });
  
  describe('POST /', function() {
    
    it('Should reject an unauthorized request', function() {
      return chai.request(app)
        .post('/api/story-network')
        .send(
          {
            isPublic: Math.random() < .5 ? true : false,
            creator: testIds.userId
          }  
        )
        .should.eventually.have.status(401);
    });
    
    it('Should reject requests missing `name', function() {
      return chai.request(app)
        .post('/api/story-network')
        .set('authorization', `Bearer ${token}`)
        .send(
          {
            isPublic: Math.random() < .5 ? true : false,
            creator: testIds.userId
          }
        )
        .should.eventually.have.status(422);
    });
    
    it('Should reject requests missing `isPublic', function() {
      return chai.request(app)
        .post('/api/story-network')
        .set('authorization', `Bearer ${token}`)
        .send(
          {
            name: faker.random.alphaNumeric(10),
            creator: testIds.userId
          }
        )
        .should.eventually.have.status(422);
    });
    
    it('Should reject requests missing `creator', function() {
      return chai.request(app)
        .post('/api/story-network')
        .set('authorization', `Bearer ${token}`)
        .send(
          {
            name: faker.random.alphaNumeric(10),
            isPublic: Math.random() < .5 ? true : false
          }
        )
        .should.eventually.have.status(422);
    });
    
    it('Should accept a valid request', function() {
      
      const testPremise = {
        name: faker.random.alphaNumeric(10),
        isPublic: Math.random() < .5 ? true : false,
        creator: testIds.userId
      };
      
      return chai.request(app)
        .post('/api/story-network')
        .send(testPremise)
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body).to.have.keys(['name', 'isPublic', 'creator', 'id']);
        });
    });
  });
  
  describe( 'GET /:id', function() {
    
    it('Should reject an unauthorized request', function() {
      const reqUrl = `/api/story-network/${testIds.storyNetwork}`;
      return chai.request(app)
        .get(reqUrl)
        .should.eventually.have.status(401);
    });
    
    it('Should reject a request with an invalid storyNetwork id', function() {
      const reqUrl = `/api/story-network/${testIds.storyNetwork}X`;
      return chai.request(app)
        .get(reqUrl)
        .set('authorization', `Bearer ${token}`)
        .should.eventually.have.status(422);
    });
    
    it('Should return correct storyNetwork with a valid request', function() {
      const reqUrl = `/api/story-network/${testIds.storyNetwork}`;
      return chai.request(app)
        .get(reqUrl)
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');
          expect(res.body._id).to.equal(String(testIds.storyNetwork));
        });
    });
    
  });
  
});