'use strict';

const {router: momentRouter } = require('../../moment');

const mongoose = require('mongoose');

describe('Moment Router', function() {

  let tempMoment;
  
  beforeEach(function() {
    tempMoment = {
      creator: testIds.userId,
      content: faker.random.alphaNumeric(100),
      isPremiseMoment: Math.random() < .5 ? true : false,
      premise: testIds.premiseMoment,
      lineage: [testIds.premiseMoment, testIds.regularMoment],
      children: []
    };

  });
  
  it('Should be defined', function() {
    expect(momentRouter).to.exist;
  });
  
  describe('POST /', function() {
    
    it('Should reject a request with a missing `creator`', function() {
      delete tempMoment.creator;
      return chai.request(app)
        .post('/api/moment')
        .send(tempMoment)
        .should.eventually.have.status(422);
    });
    
    it('Should reject a request with a missing `content`', function() {
      delete tempMoment.content;
      return chai.request(app)
        .post('/api/moment')
        .send(tempMoment)
        .should.eventually.have.status(422);
    });
    
    it('Should reject a request with a missing `isPremiseMoment`', function() {
      delete tempMoment.isPremiseMoment;
      return chai.request(app)
        .post('/api/moment')
        .send(tempMoment)
        .should.eventually.have.status(422);
    });
    
    it('Should reject a request with a missing `premise`, '
       + 'if `isPremiseMoment` is false' , function() {
      delete tempMoment.premise;
      tempMoment.isPremiseMoment = false;
      return chai.request(app)
        .post('/api/moment')
        .send(tempMoment)
        .should.eventually.have.status(422);
    });
    
    it('Should reject a request with a missing `lineage`, '
       + 'if `isPremiseMoment` is false', function() {
      delete tempMoment.lineage;
      tempMoment.isPremiseMoment = false;
      return chai.request(app)
        .post('/api/moment')
        .send(tempMoment)
        .should.eventually.have.status(422);
    });
    
    it('Should reject a request with a missing `children`', function() {
      delete tempMoment.children;
      return chai.request(app)
        .post('/api/moment')
        .send(tempMoment)
        .should.eventually.have.status(422);
    });
    
    it('Should reject requests where `content` != string', function() {
      tempMoment.content = 123;
      return chai.request(app)
        .post('/api/moment')
        .send(tempMoment)
        .should.eventually.have.status(422);
    });
    
    it('Should reject requests where content.length > 200', function() {
      tempMoment.content = faker.random.alphaNumeric(201);
      return chai.request(app)
        .post('/api/moment')
        .send(tempMoment)
        .should.eventually.have.status(422);
    });
    
    it('Should reject requests where `isPremiseMoment` != boolean', function() {
      tempMoment.isPremiseMoment = 'foo';
      return chai.request(app)
        .post('/api/moment')
        .send(tempMoment)
        .should.eventually.have.status(422);
    });
    
    it('Should accept a valid request and return a correctly-build '
       + 'moment object', function () {
      tempMoment.lineage = [];
      tempMoment.isPremiseMoment = true;
      return chai.request(app)
        .post('/api/moment')
        .send(tempMoment)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body).to.include.keys(['creator', 'content',
                                            'isPremiseMoment', 'lineage',
                                            'children']);
        });
    });
  });
  
  describe( 'GET/:id', function() {
    
    it('Should reject requests with an invalid momentId', function() {
      const brokenMomentId = testIds.regularMoment + 'X';
      return chai.request(app)
        .get(`/api/moment/${brokenMomentId}`)
        .then(function(res) {
          expect(res).to.have.status(422);
        });
    });
    
    it('Should return the correct moment', function() {
      return chai.request(app)
        .get(`/api/moment/${testIds.regularMoment}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');
          expect(res.body._id).to.equal(String(testIds.regularMoment));
        });
    });
  });
  
  describe( 'GET /storychain?start=:id&end=:id', function() {
    
    it('Should reject requests with an invalid end momentId', function() {
      const reqUrl = `/api/moment/storychain?start=${testIds.premiseMoment}`
                     + `&end=${testIds.regularMoment + 'X'}`;
      return chai.request(app)
        .get(reqUrl)
        .then(function(res) {
          expect(res).to.have.status(422);
        });
    });
    
    it('Should reject requests with an invalid start mometnId', function() {
      const reqUrl = `/api/moment/storychain?start=${testIds.premiseMoment+'X'}`
                     + `&end=${testIds.regularMoment}`;
      return chai.request(app)
        .get(reqUrl)
        .then(function(res) {
          expect(res).to.have.status(422);
        });
    });


    it('It should return the correct storyChain', function() {
      const reqUrl = `/api/moment/storychain?start=${testIds.premiseMoment}`
                     + `&end=${testIds.regularMoment}`;
      return chai.request(app)
        .get(reqUrl)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.an('object');
        });
    });

  });
  
  
});