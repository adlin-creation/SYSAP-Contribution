const { Given, When, Then } = require('@cucumber/cucumber');
const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const app = require('./server.ts'); 
const axios = require('axios');

let token;
let response;

// Étape Given: L'utilisateur est connecté
Given('I am logged in as a user', (done) => {
  supertest(app)
    .post('/login')
    .send({ username: 'testUser', password: 'testPassword' })
    .end((err, res) => {
      if (err) return done(err);
      token = res.body.token;  // Récupérer le token de l'authentification
      done();
    });
    return 'pending';
});

// Étape When: L'utilisateur soumet un formulaire de création de programme valide
When('I submit a valid program creation form', (done) => {
  const programData = {
    name: 'Test Program',
    description: 'A program for testing',
    duration: 30,
    duration_unit: 'days',
    sessions: [1, 2],
    imageUrl: 'https://example.com/test-image.jpg',
  };

  supertest(app)
    .post('/create-program')
    .set('Authorization', `Bearer ${token}`)
    .send(programData)
    .end((err, res) => {
      if (err) return done(err);
      response = res;
      done();
    });
    return 'pending';
});

// Étape Then: L'utilisateur voit un message de succès
Then('I should see a success message', () => {
  expect(response.status).to.equal(201);
  expect(response.body.message).to.equal('Program created successfully');
  return 'pending';
});

// Étape When: L'utilisateur soumet un formulaire de création de programme incomplet
When('I submit an incomplete program creation form', (done) => {
  const incompleteProgramData = {
    name: '',
    description: 'A program with missing name',
  };

  supertest(app)
    .post('/create-program')
    .set('Authorization', `Bearer ${token}`)
    .send(incompleteProgramData)
    .end((err, res) => {
      if (err) return done(err);
      response = res;
      done();
    });
    return 'pending';
});

// Étape Then: L'utilisateur voit un message d'erreur
Then('I should see an error message indicating the missing fields', () => {
  expect(response.status).to.equal(400);
  expect(response.body.message).to.equal('Validation failed');
  return 'pending';
});


