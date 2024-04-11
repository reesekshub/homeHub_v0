// ********************** Initialize server **********************************

const server = require('../index'); //TODO: Make sure the path to your index.js is correctly added

// ********************** Import Libraries ***********************************

const chai = require('chai'); // Chai HTTP provides an interface for live integration testing of the API's.
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

// ********************** DEFAULT WELCOME TESTCASE ****************************

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });
});

//********************** REGISTRATION TESTCASES *********************** */
describe('Registration API Tests', () => {
  it('Positive Test Case: Successfully registers a new user', done => {
    chai.request(server)
      .post('/register')
      .send({ username: 'ptest1@gmail.com', password: '123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('User registered successfully');
        done();
      });
  });

  it('Negative Test Case: Fails to register a new user due to invalid email', done => {
    chai.request(server)
      .post('/register')
      .send({ username: '', password: '123' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Invalid input');
        done();
      });
  });
});

//********************** LOGIN TESTCASES *********************** */
describe('Login API Tests', () => {
  it('Positive Test Case: Successfully logs in with valid credentials', done => {
    chai.request(server)
      .post('/login')
      .send({ username: 'ptest1@gmail.com', password: '123' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Login successful');
        done();
      });
  });

  it('Negative Test Case: Fails to log in with invalid credentials', done => {
    chai.request(server)
      .post('/login')
      .send({ username: 'ptest1@gmail.com', password: 'wrongpassword' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.message).to.equal('Invalid credentials');
        done();
      });
  });
});



// ********************************************************************************