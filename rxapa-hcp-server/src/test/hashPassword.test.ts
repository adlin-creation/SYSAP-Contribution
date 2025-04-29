

import bcrypt from "bcrypt"; // ou "bcryptjs" selon ton projet

describe("hashPassword", () => {
  it("should hash the password correctly", async () => {
    const password = "mySuperSecretPassword";
    const hashedPassword = await bcrypt.hash(password, 10);

    const isMatch = await bcrypt.compare(password, hashedPassword);

    expect(isMatch).toBe(true); // Le mot de passe doit correspondre après hash
  });
});

