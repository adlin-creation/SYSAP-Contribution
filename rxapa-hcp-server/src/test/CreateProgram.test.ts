const ProgramController = require ("../controller/ProgramController");
import { Program } from "../model/Program";
import { ProgramSession } from "../model/ProgramSession";
import { expect, jest } from "@jest/globals";
import { Request, Response } from "express";


// Mock des modèles Sequelize pour éviter les accès à la base de données
jest.mock("../model/Program", () => ({
  Program: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("../model/ProgramSession", () => ({
  ProgramSession: {
    create: jest.fn(),
  },
}));

const mockCreate = Program.create;
const mockFindOne = Program.findOne;
const mockSessionCreate = ProgramSession.create;

describe("createProgram", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        name: "My Program",
        description: "A test program",
        duration: 30,
        duration_unit: "days",
        imageUrl: "https://i.pinimg.com/originals/bb/35/0a/bb350a6272df756b915ee37691fdcdc0.png",
        sessions: [1, 2], // Vérifie que des sessions existent bien
      },
    };
    res = {
      statusCode: 500,
      json: jest.fn() as jest.MockedFunction<Response["json"]>,
      status: jest.fn((code: number) => {
        (res as any).statusCode = code;
        return res;
      }) as jest.MockedFunction<Response["status"]>,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules(); 
  });

  // Test de création réussie
  it("Should create a program successfully", async () => {
    mockFindOne.mockResolvedValue(null); // Vérifie que le programme n'existe pas déjà
    mockCreate.mockResolvedValue({
      id: 1,
      name: "My Program",
      description: "A test program",
      duration: 30,
      duration_unit: "days",
      image: "https://i.pinimg.com/originals/bb/35/0a/bb350a6272df756b915ee37691fdcdc0.png",
    });

    mockSessionCreate.mockResolvedValue({ programId: 1, sessionId: 1 });

    console.log("mockFindOne calls: ", mockFindOne.mock.calls);
    console.log("mockCreate calls: ", mockCreate.mock.calls);
    console.log("mockSessionCreate calls: ", mockSessionCreate.mock.calls);

    const programHandler = ProgramController.createProgram[1];
    await programHandler(req as Request, res as Response, jest.fn());
    
    expect(mockCreate).toHaveBeenCalledWith({
      name: "My Program",
      description: "A test program",
      duration: 30,
      duration_unit: "days",
      image: "https://i.pinimg.com/originals/bb/35/0a/bb350a6272df756b915ee37691fdcdc0.png",
    });

    expect(mockSessionCreate).toHaveBeenCalledTimes(req.body.sessions.length); // Vérifie que toutes les sessions sont créées

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Exercise program created",
    });
  });

  //Test d'erreur serveur lors de la création
  it("Should handle error when creating program", async () => {
    mockCreate.mockRejectedValue(new Error("Program creation failed")); // Simule une erreur

    const programHandler = ProgramController.createProgram[1];
    await programHandler(req as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to create an exercise program"
    });
  });

  // Test d'erreur si des champs sont manquants
 // Test : nom manquant
  it("Should return 400 if name is missing", async () => {
    req.body.name = "";
    const validateHandler = ProgramController.createProgram[0];
    await validateHandler(req as Request, res as Response, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Le nom du programme est requis.",
    });
  });

// Test : description manquante
  it("Should return 400 if description is missing", async () => {
    req.body.description = "";
    const validateHandler = ProgramController.createProgram[0];
    await validateHandler(req as Request, res as Response, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "La description est trop longue (max 500 caractères).",
    });
  });

    // Test : durée 0
    it("Should return 400 if duration is 0", async () => {
        req.body.duration = 0;
        const validateHandler = ProgramController.createProgram[0];
        await validateHandler(req as Request, res as Response, jest.fn());
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
        message: "La durée doit être d'au moins 1 jour ou 1 semaine.",
        });
    });

    // Test : mauvaise unité de durée
    it("Should return 400 if duration_unit is invalid", async () => {
    req.body.duration_unit = "month";
    const validateHandler = ProgramController.createProgram[0];
    await validateHandler(req as Request, res as Response, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
        message: "L'unité de durée doit être 'days' ou 'weeks'.",
    });
    });
    
});
