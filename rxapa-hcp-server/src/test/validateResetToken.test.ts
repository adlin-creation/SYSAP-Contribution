// Importation du middleware à tester
import { validateResetToken } from "../middleware/validateResetToken";

// Mock du modèle Sequelize Professional_User
import { Professional_User } from "../model/Professional_User";
import { Request, Response } from "express";

// Mock du modèle Sequelize pour isoler les tests (évite de toucher à la vraie base)
jest.mock("../model/Professional_User");

describe("validateResetToken middleware", () => {
  // Mock des fonctions de réponse et du middleware suivant
  const mockNext = jest.fn();
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  // Réinitialise les mocks après chaque test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Cas 1 : Aucun token fourni (ni dans body, ni dans query)
  it("renvoie une erreur 400 si aucun token n'est fourni", async () => {
    const mockReq = { body: {}, query: {} } as Request;

    await validateResetToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Token requis." });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // Cas 2 : Token fourni mais aucun utilisateur correspondant
  it("renvoie une erreur 400 si aucun utilisateur n'est trouvé", async () => {
    // Simule un retour "null" de la DB
    (Professional_User.findOne as jest.Mock).mockResolvedValue(null);

    const mockReq = {
      body: { token: "invalidtoken" },
      query: {},
    } as Request;

    await validateResetToken(mockReq, mockRes, mockNext);

    expect(Professional_User.findOne).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Token invalide ou expiré." });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // Cas 3 : Le token est valide, on passe au middleware suivant
  it("passe au middleware suivant si le token est valide", async () => {
    const fakeUser = { id: 1, email: "test@ex.com" };
    (Professional_User.findOne as jest.Mock).mockResolvedValue(fakeUser);

    const mockReq = {
      body: { token: "validtoken" },
      query: {},
    } as unknown as Request;

    await validateResetToken(mockReq, mockRes, mockNext);

    // On s'attend à ce que le user soit attaché à la requête
    expect((mockReq as any).user).toBe(fakeUser);
    expect(mockNext).toHaveBeenCalled(); // On passe au middleware suivant
  });

  // Cas 4 : Erreur interne lors de la requête Sequelize
  it("renvoie une erreur 500 en cas d'erreur interne", async () => {
    (Professional_User.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));

    const mockReq = {
      body: { token: "tokentest" },
      query: {},
    } as Request;

    await validateResetToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Erreur lors de la validation du token." });
  });
});