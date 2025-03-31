import express from "express";
import request from "supertest";
import { loginLimiter } from "../middleware/rateLimiter";

describe("loginLimiter middleware", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();

    // Utilise le middleware comme dans ton routeur
    app.use("/login", loginLimiter, (req, res) => {
      res.status(200).send("Connexion autorisée");
    });
  });

  it("autorise jusqu'à 3 requêtes", async () => {
    for (let i = 0; i < 3; i++) {
      const res = await request(app).get("/login");
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe("Connexion autorisée");
    }
  });

  it("bloque la 4e requête avec un code 429", async () => {
    for (let i = 0; i < 3; i++) {
      await request(app).get("/login");
    }

    const res = await request(app).get("/login");

    expect(res.statusCode).toBe(429);
    expect(res.body).toEqual({
      message: "Trop de tentatives de connexion. Réessayez dans 1 minutes.",
    });
  });
});