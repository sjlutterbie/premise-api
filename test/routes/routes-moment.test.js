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
      lineages: [testIds.premiseMoment, testIds.regularMoment],
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
    
    it('Should reject a request with a missing `lineages`, '
       + 'if `isPremiseMoment` is false', function() {
      delete tempMoment.lineages;
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
      tempMoment.lineages = [];
      tempMoment.isPremiseMoment = true;
      return chai.request(app)
        .post('/api/moment')
        .send(tempMoment)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body).to.include.keys(['creator', 'content',
                                            'isPremiseMoment', 'lineages',
                                            'children']);
        });
      
      
      
    });
    
    

  });
});