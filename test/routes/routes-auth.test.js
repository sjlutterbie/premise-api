'use strict';

require('dotenv').config();
const { JWT_SECRET } = require('../../config');

const { router: authRouter } = require('../../auth');

describe('Authentication Router', function() {
  
  it('Should be defined', function() {
    expect(authRouter).to.exist;
  });
  
  describe('GET /test', function() {
    
    it('Should reject a request with no JWT', function() {
      return chai.request(app)
        .get('/api/auth/test')
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    
    it('Should reject users with an incorrect JWT', function() {
      return chai.request(app)
        .get('/api/auth/test')
        .set('authorization', `Bearer ${token}X`)
        .then(function(res) {
          expect(res).to.have.status(401);
        });
    });
    
    it('Should accept an authorized request', function() {
      return chai.request(app)
        .get('/api/auth/test')
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Authentication successful');
        });
    });
    



  });
  
  
});