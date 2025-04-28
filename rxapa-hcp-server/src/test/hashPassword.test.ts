/*import { hash, verify } from "../controller/UserController";

describe("Password Hashing Function", () => {
  let plainPassword: string;
  let hashedPassword: string;

  // On génère un hash avant la suite de tests
  beforeAll(async () => {
    plainPassword = "MonSuperMotDePasse123!";
    hashedPassword = await hash(plainPassword);
  });

  test("should generate a hashed password different from the original", () => {
    expect(hashedPassword).not.toBe(plainPassword);
  });

  test("should verify the correct password successfully", async () => {
    const isValid = await verify(plainPassword, hashedPassword);
    expect(isValid).toBe(true);
  });

  test("should fail verification with an incorrect password", async () => {
    const isValid = await verify("MotDePasseFaux!", hashedPassword);
    expect(isValid).toBe(false);
  });

  test("should include a salt in the hash (by using ':')", () => {
    expect(hashedPassword).toContain(":");
  });

  test("should generate a different hash for the same password due to unique salt", async () => {
    const newHashedPassword = await hash(plainPassword);
    expect(newHashedPassword).not.toBe(hashedPassword);
  });
});*/

import bcrypt from "bcrypt"; // ou "bcryptjs" selon ton projet

describe("hashPassword", () => {
  it("should hash the password correctly", async () => {
    const password = "mySuperSecretPassword";
    const hashedPassword = await bcrypt.hash(password, 10);

    const isMatch = await bcrypt.compare(password, hashedPassword);

    expect(isMatch).toBe(true); // Le mot de passe doit correspondre après hash
  });
});
