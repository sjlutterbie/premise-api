'use strict'

const {router: userRouter } = require('../../user');

describe('User Router', function() {
  
  it('Should be defined', function() {
    expect(userRouter).to.exist;
  });
  
  describe('POST /', function() {
    
    it('Should reject requests with a missing username', function() {
      return chai.request(app)
          .post('/api/user')
          .send(
            {
              password: faker.random.alphaNumeric(10),
              email: faker.internet.email()
            })
          .should.eventually.have.status(422);
    });
    
    it('Should reject requests with a missing password', function() {
      return chai.request(app)
          .post('/api/user')
          .send(
            {
              username: faker.random.alphaNumeric(10),
              email: faker.internet.email()
            })
          .should.eventually.have.status(422);
    });
    
    it('Should reject requests with a missing email', function() {
      return chai.request(app)
          .post('/api/user')
          .send(
            {
              username: faker.random.alphaNumeric(10),
              password: faker.random.alphaNumeric(10)
            })
          .should.eventually.have.status(422);
    });
    
    it('Should reject requests with a non-string username', function() {
      return chai.request(app)
        .post('/api/user')
        .send(
          {
            username: faker.random.number(),
            password: faker.random.alphaNumeric(10),
            email: faker.internet.email()
          }
        )
        .should.eventually.have.status(422);
    });
    
    it('Should reject requests with a non-string password', function() {
      return chai.request(app)
        .post('/api/user')
        .send(
          {
            username: faker.random.alphaNumeric(10),
            password: faker.random.number(),
            email: faker.internet.email()
          }
        )
        .should.eventually.have.status(422);
    });
    
    it('Should reject requests with a non-string email', function() {
      return chai.request(app)
        .post('/api/user')
        .send(
          {
            username: faker.random.alphaNumeric(10),
            password: faker.random.alphaNumeric(10),
            email: faker.random.number()
          }
        )
        .should.eventually.have.status(422);
    });
    
    it('Should reject requests with a non-string firstName', function() {
      return chai.request(app)
        .post('/api/user')
        .send(
          {
            username: faker.random.alphaNumeric(10),
            password: faker.random.alphaNumeric(10),
            email: faker.internet.email(),
            firstName: faker.random.number()
          }
        )
        .should.eventually.have.status(422);
    });
    
    it('Should reject requests with a non-string lastName', function() {
      return chai.request(app)
        .post('/api/user')
        .send(
          {
            username: faker.random.alphaNumeric(10),
            password: faker.random.alphaNumeric(10),
            email: faker.internet.email(),
            lastName: faker.random.number()
          }
        )
        .should.eventually.have.status(422);
    });

  });
});