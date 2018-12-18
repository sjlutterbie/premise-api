const chai = require('chai');
const chaiHttp = require('chai-http');

const {app} = require('./server');

const should = chai.should();
chai.use(chaiHttp);

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