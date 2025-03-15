import { expect } from "chai"; // Importation de Chai pour les assertions
import request from "supertest"; // Importation de Supertest pour tester les routes Express
import app from "../server"; // Importation de l'application Express principale
import { Professional_User } from "../model/Professional_User"; // Importation du modèle ProfessionalUser pour interagir avec la base de données
import { hash } from "../controller/UserController"; // Importation de la fonction de hachage

describe("Authentication API - Login", function () {
  
  // `before()` permet d’exécuter une préparation avant les tests.
  beforeEach(async function () {
    // Suppression de l'utilisateur "test@example.com" s'il existe déjà.
    await Professional_User.destroy({ where: { email: "test@example.com" } });

    // Hachage du mot de passe pour stocker un utilisateur valide dans la base de données.
    const hashedPassword = await hash("ValidPassword123");

    // Création d’un utilisateur de test dans la base de données.
    await Professional_User.create({
      firstname: "test",
      lastname: "test",
      email: "test@example.com",
      phoneNumber: "1234567890",
      role: "doctor",
      password: hashedPassword, // Stockage du mot de passe sécurisé
    });
  });

  /**
   * Test 1 : Connexion réussie avec les bons identifiants.
   */
  it("Should successfully login with valid credentials", async function () {
    // Envoi d'une requête POST avec un email et un mot de passe corrects.
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "ValidPassword123" });

    // Vérification que le statut HTTP est bien 200 (OK).
    expect(response.status).to.equal(200);
    // Vérification que le corps de la réponse contient un token JWT.
    expect(response.body).to.have.property("token");
    // Vérification que l'ID utilisateur est bien renvoyé.
    expect(response.body).to.have.property("userId");
    // Vérification que le rôle de l'utilisateur est bien renvoyé.
    expect(response.body).to.have.property("role");
  });

  /**
   * Test 2 : Connexion échoue avec un mauvais mot de passe.
   */
  it("Should fail login with incorrect password", async function () {
    // Envoi d'une requête POST avec un mot de passe incorrect.
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "WrongPassword!" });

    // Vérification que la requête échoue avec un statut HTTP 401 (Unauthorized).
    expect(response.status).to.equal(401);
    // Vérification que la réponse contient un message d'erreur.
    expect(response.body).to.have.property("message", "Please enter the correct email and password");
  });

  /**
   * Test 3 : Connexion échoue pour un utilisateur inexistant.
   */
  it("Should fail login for non-existent user", async function () {
    // Envoi d'une requête POST avec un email qui n'existe pas en base.
    const response = await request(app)
      .post("/login")
      .send({ email: "doesnotexist@example.com", password: "AnyPassword123" });

    // Vérification que la requête échoue avec un statut HTTP 401 (Unauthorized).
    expect(response.status).to.equal(401);
    // Vérification que la réponse contient un message d'erreur.
    expect(response.body).to.have.property("message", "The user doesn't exist");
  });

  afterAll(async function () {
    await Professional_User.destroy({ where: { email: "test@example.com" } });
  });

});