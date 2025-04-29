import { Request, Response, NextFunction } from "express";
import isAuth from "../middleware/isAuth"; // Ajustez le chemin si besoin
import { Professional_User } from "../model/Professional_User";
import jwt from "jsonwebtoken";

// On étend Request pour typer user / userRole
interface TestRequest extends Request {
  user?: any;
  userRole?: string;
}

// On mock la BDD et jwt
jest.mock("../model/Professional_User");
jest.mock("jsonwebtoken");

describe("Middleware isAuth", () => {
  let mockReq: Partial<TestRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Objets mock pour chaque test
    mockReq = { headers: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();

    // On définit une clé pour JWT (pour le test)
    process.env.TOKEN_SECRET_KEY = "test_secret_key";
  });

  // On réinitialise complètement les mocks après chaque test
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Retourne 401 si l'en-tête Authorization est absent", async () => {
    await isAuth(mockReq as TestRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "error_authentification_required",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('Retourne 401 si le header Authorization ne commence pas par "Bearer "', async () => {
    mockReq.headers = { authorization: "NotBearer xyz" };

    await isAuth(mockReq as TestRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "error_authentification_required",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("Retourne 401 si le token est invalide ou expiré", async () => {
    mockReq.headers = { authorization: "Bearer invalidToken" };
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await isAuth(mockReq as TestRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "error_invalid_token",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("Retourne 401 si l'utilisateur n'est pas trouvé en BDD", async () => {
    mockReq.headers = { authorization: "Bearer validToken" };
    // On simule un payload decodé
    (jwt.verify as jest.Mock).mockReturnValue({
      email: "not_found@example.com",
    });

    // findOne renvoie null => pas d'utilisateur
    (Professional_User.findOne as jest.Mock).mockResolvedValue(null);

    await isAuth(mockReq as TestRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "error_user_not_found",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // On fait un test paramétré pour différents rôles
  const rolesToTest = [
    "admin",
    "doctor",
    "kinesiologist",
    "superadmin",
  ] as const;

  rolesToTest.forEach((role) => {
    it(`Passe au next() si un utilisateur est trouvé en BDD avec le rôle "${role}"`, async () => {
      mockReq.headers = { authorization: "Bearer validToken" };
      (jwt.verify as jest.Mock).mockReturnValue({
        email: `${role}@example.com`,
      });

      // Simulation du user trouvé avec un certain rôle
      (Professional_User.findOne as jest.Mock).mockResolvedValue({
        email: `${role}@example.com`,
        role,
      });

      await isAuth(mockReq as TestRequest, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user?.email).toBe(`${role}@example.com`);
      expect(mockReq.userRole).toBe(role);
    });
  });
});
