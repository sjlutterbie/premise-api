'use strict';

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
    
    it('Should reject requests with a non-trimmed username', function() {
      return chai.request(app)
        .post('/api/user')
        .send(
          {
            username: ' ' + faker.random.alphaNumeric(10)+ '   ',
            password: faker.random.alphaNumeric(10),
            email: faker.internet.email()
          }  
        )
        .should.eventually.have.status(422);
    });
    
    it('Should reject requests with a non-trimmed password', function() {
      return chai.request(app)
        .post('/api/user')
        .send(
          {
            username: faker.random.alphaNumeric(10),
            password: ' ' + faker.random.alphaNumeric(10) + '   ',
            email: faker.internet.email()
          }  
        )
        .should.eventually.have.status(422);
    });
    
    it('Should reject requests with a non-trimmed email', function() {
      return chai.request(app)
        .post('/api/user')
        .send(
          {
            username: faker.random.alphaNumeric(10),
            password: faker.random.alphaNumeric(10),
            email: ' ' + faker.internet.email() + '   '
          }  
        )
        .should.eventually.have.status(422);
    });
    
    it('Should reject a request with too short a password', function() {
      // Min password length: 10
      return chai.request(app)
        .post('/api/user')
        .send(
          {
            username: faker.random.alphaNumeric(10),
            password: faker.random.alphaNumeric(9),
            email: faker.internet.email()
          }
        )
        .should.eventually.have.status(422);
    });
    
    it('Should reject a request with too long a password', function() {
      // Max password length: 71
      return chai.request(app)
        .post('/api/user')
        .send(
          {
            username: faker.random.alphaNumeric(10),
            password: faker.random.alphaNumeric(72),
            email: faker.internet.email()
          }
        )
        .should.eventually.have.status(422);
    });
    
    it('Should reject a request with too short a username', function() {
      // Min username length: 1
      return chai.request(app)
        .post('/api/user')
        .send(
          {
            username: '',
            password: faker.random.alphaNumeric(10),
            email: faker.internet.email()
          }
        )
        .should.eventually.have.status(422);
    });

    it('Should reject a request with an existing username', function() {
      const tempUser = {
        username: testUser.username,
        password: faker.random.alphaNumeric(10),
        email: faker.internet.email()
      };
      return chai.request(app)
        .post('/api/user')
        .send(tempUser)
        .should.eventually.have.status(422);
    });
    
    it('Should accept a valid request', function() {
      const testUser = {
        username: faker.random.alphaNumeric(10),
        password: faker.random.alphaNumeric(10),
        email: faker.internet.email(),
        firstName: faker.random.alphaNumeric(10),
        lastName: faker.random.alphaNumeric(10)
      };
      return chai.request(app)
        .post('/api/user')
        .send(testUser)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res.body).to.have.keys(
            ['username', 'email', 'firstName', 'lastName',
             'storyNetworks', 'id']
          );
        });
    });
  });
  
  describe('GET /:id', function() {
    
    it('Should reject an unauthorized request', function() {
      const reqUrl = `/api/user/${testIds.userId}`;
      return chai.request(app)
        .get(reqUrl)
        .should.eventually.have.status(401);
    });
    
    it('Should reject requests with an invalid user Id', function() {
      const reqUrl = `/api/user/${testIds.userId}X`;
      return chai.request(app)
        .get(reqUrl)
        .set('authorization', `Bearer ${token}`)
        .should.eventually.have.status(422);
    });
    
    it('Should return the correct user with valid request', function() {
      const reqUrl = `/api/user/${testIds.userId}`;
      return chai.request(app)
        .get(reqUrl)
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');
          expect(res.body._id).to.equal(String(testIds.userId));
        });
    });
  });
  
  describe('GET /username/:username', function() {
    
    it('Should reject an unauthorized request', function() {
      const reqUrl = `/api/user/username/${testIds.username}`;
      return chai.request(app)
        .get(reqUrl)
        .should.eventually.have.status(401);
    });
    
    it('Should reject a request with an invalid username', function() {
      const reqUrl = `/api/user/username/${testIds.username}X`;
      return chai.request(app)
        .get(reqUrl)
        .set('authorization', `Bearer ${token}`)
        .should.eventually.have.status(422);
    });
    
    it('Should return the correct user with a valid request', function() {
      const reqUrl = `/api/user/username/${testUser.username}`;
      return chai.request(app)
        .get(reqUrl)
        .set('authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.an('object');
          expect(res.body.username).to.equal(testUser.username);
        });
    });
    
  });
});