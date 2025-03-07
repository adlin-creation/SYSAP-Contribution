import { expect } from "chai";  // Importation de Chai pour les assertions
import { hash, verify } from "../controller/UserController"; // Import de la fonction hash
import { describe, it } from "mocha";  // Mocha pour la structure des tests

describe("Password Hashing Function", function () {
  let plainPassword: string;
  let hashedPassword: string;

  // Avant les tests, on génère un hash pour le mot de passe
  before(async function () {
    plainPassword = "MonSuperMotDePasse123!";
    hashedPassword = await hash(plainPassword);
  });

  // Vérifier que le hash est différent du mot de passe original
  it("should generate a hashed password different from the original", function () {
    expect(hashedPassword).to.not.equal(plainPassword);
  });

  // Vérifier que le mot de passe correct passe la vérification
  it("should verify the correct password successfully", async function () {
    const isValid = await verify(plainPassword, hashedPassword);
    expect(isValid).to.be.true;
  });

  // Vérifier qu'un mot de passe incorrect ne passe pas la vérification
  it("should fail verification with an incorrect password", async function () {
    const isValid = await verify("MotDePasseFaux!", hashedPassword);
    expect(isValid).to.be.false;
  });

  // Vérifier que le hash inclut un sel (":")
  it("should include a salt in the hash", function () {
    expect(hashedPassword).to.include(":");
  });

  // Vérifier que le même mot de passe génère des hashs différents (grâce au sel)
  it("should generate a different hash for the same password due to unique salt", async function () {
    const newHashedPassword = await hash(plainPassword);
    expect(newHashedPassword).to.not.equal(hashedPassword);
  });
});