'use strict';

const { runServer, closeServer } = require('../../server');

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