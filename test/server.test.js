'use strict';

const chai = require('chai');
  const expect = chai.expect;
  const should = chai.should();
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
const chaiAsPromised = require('chai-as-promised');
  chai.use(chaiAsPromised);
  
const faker = require('faker');

require('dotenv').config();
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require('../config');

const {app, runServer, closeServer} = require('../server');

describe('API', () => {
  
  it('Should return 200 on GET /api/', () => {
    return chai.request(app)
      .get('/api/connectionTest')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
      });
  });
  
  it('Should return 404 on non /api/ GET paths', () => {
    return chai.request(app)
      .get('/'+faker.random.alphaNumeric(10))
      .then(function(res) {
        res.should.have.status(404);
      });
  });
});

describe('Server functions', () => {
  
  describe('closeServer', () => {
    
    it('Should be defined', () => {
      expect(closeServer).to.be.a('function');
    });
  });

  describe('runServer', () => {
    
    afterEach(() => {
      closeServer();
    });
    
    it('Should return a promise object', () => {
      let promObj = runServer(TEST_DATABASE_URL);
        promObj.then( () => {
          closeServer();
        }).catch( (err) => {
          closeServer();
        });
      return expect(promObj).to.be.a('Promise');
    });
  });
});