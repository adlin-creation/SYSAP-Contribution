const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('../../app');  

describe('Program API Tests', () => {
  let token;

  // Avant chaque test, obtenir un token (si l'authentification est nécessaire)
  before((done) => {
    supertest(app)
      .post('/login')  // L'endpoint pour se connecter
      .send({ username: 'testUser', password: 'testPassword' })
      .end((err, res) => {
        if (err) done(err);
        token = res.body.token;
        done();
      });
  });

  it('should create a new program with valid data', (done) => {
    const programData = {
      name: 'Test Program',
      description: 'A program for testing',
      duration: 30,
      duration_unit: 'days',
      sessions: [1, 2],  // Liste des sessions que vous souhaitez associer
      imageUrl: 'https://example.com/test-image.jpg',  // L'URL de l'image
    };

    supertest(app)
      .post('/create-program')  // Endpoint pour créer un programme
      .set('Authorization', `Bearer ${token}`)
      .send(programData)
      .expect(201)  // Code HTTP attendu
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.message).to.equal('Exercise program created');
        done();
      });
  });

  it('should return error for missing required fields', (done) => {
    const programData = {
      name: '',  // Champ requis vide
      description: 'A program with missing name',
    };

    supertest(app)
      .post('/create-program')
      .set('Authorization', `Bearer ${token}`)
      .send(programData)
      .expect(400)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.message).to.equal('Validation failed');
        done();
      });
  });

});
