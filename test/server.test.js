'use strict';

require('dotenv').config();
const { PORT, TEST_DATABASE_URL, JWT_SECRET } = require('../config');

const chai = require('chai');
  const expect = chai.expect;
  const should = chai.should();
const chaiHttp = require('chai-http');
  chai.use(chaiHttp);
const chaiAsPromised = require('chai-as-promised');
  chai.use(chaiAsPromised);

const {app, runServer, closeServer} = require('../server');

describe('API', () => {
  
  it('Should return 200 on GET reqeuests', () => {
    return chai.request(app)
      .get('/api/foooo')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
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
      expect(promObj).to.be.a('Promise');
    });
    
    it('Should resolve as an object', () => {
      let promObj = runServer(TEST_DATABASE_URL);
      return expect(promObj).to.eventually.be.an('Object');
      return expect(promObj.status).to.eventually.equal('Connected to server');
    });
  
    it('Should return an error object after a failed connection', () => {
      let promObj = runServer(TEST_DATABASE_URL+'XXX');
      expect(promObj).to.eventually.throw();
    });
  
  
  });
});