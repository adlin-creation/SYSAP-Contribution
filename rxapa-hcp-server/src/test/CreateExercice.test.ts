import { createExercise } from "../controller/ExerciseController";
import { Exercise } from "../model/Exercise";
import { expect, jest } from "@jest/globals";
import { Request, Response } from "express";
import { Readable } from "stream";
import { UniqueConstraintError } from "sequelize";
import { deleteFile } from "../util/file";

jest.mock("../util/file", () => ({
  deleteFile: jest.fn(),
}));

jest.mock("../model/Exercise", () => ({
  Exercise: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

const mockCreate = Exercise.create;

describe("createExercise", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      body: {
        name: "Push-up",
        description: "Un exercice de force au poids du corps qui sollicite principalement les pectoraux, les triceps et les épaules.",
        category: "Force",
        fitnessLevel: "Intermédiaire",
      },
      file: {
        fieldname: "exerciseImage",
        originalname: "image.jpg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        size: 1024,
        destination: "/uploads",
        filename: "image.jpg",
        path: "/images/image.jpg",
        buffer: Buffer.from(""),
        stream: new Readable(),
      },
    };
    res = {
      statusCode: 500,
      json: jest.fn() as jest.MockedFunction<Response['json']>,
      status: jest.fn((code: number) => {
        (res as any).statusCode = code;
        return res;
      }) as jest.MockedFunction<Response['status']>,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should create an exercise successfully", async () => {
    mockCreate.mockResolvedValue({
      id: 1,
      key: "550e8400-e29b-41d4-a716-446655440000",
      name: "Push-up",
      description: "Un exercice de force au poids du corps qui sollicite principalement les pectoraux, les triceps et les épaules.",
      category: "Force",
      fitnessLevel: "Intermédiaire",
      imageUrl: "/uploads/image.jpg",
    });

    await createExercise(req as Request, res as Response);

    expect(mockCreate).toHaveBeenCalledWith({
      name: "Push-up",
      description: "Un exercice de force au poids du corps qui sollicite principalement les pectoraux, les triceps et les épaules.",
      category: "Force",
      fitnessLevel: "Intermédiaire",
      imageUrl: "/uploads/image.jpg",
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Exercice créé avec succès.",
    });
  });

  it("Should return 409 if the exercise already exists", async () => {
    mockCreate.mockRejectedValue(new UniqueConstraintError({ message: "Duplicate entry", errors: [] }));

    await createExercise(req as Request, res as Response);

    expect(mockCreate).toHaveBeenCalledWith({
      name: "Push-up",
      description: "Un exercice de force au poids du corps qui sollicite principalement les pectoraux, les triceps et les épaules.",
      category: "Force",
      fitnessLevel: "Intermédiaire",
      imageUrl: "/uploads/image.jpg",
    });

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Un exercice avec ce nom existe déjà !",
    });
  });

  it("Should return 400 if required fields are missing", async () => {
    req.body = {}; // Simulating missing fields

    await createExercise(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tous les champs obligatoires doivent être remplis !",
    });
  });

  it("Should handle error when creating exercise", async () => {
    const errorMessage = "Exercise creation failed";
    mockCreate.mockRejectedValue(new Error(errorMessage));

    await createExercise(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erreur lors de la création de l'exercice.",
      error: errorMessage,
    });
  });

  it("Should delete uploaded file if exercise creation fails", async () => {
    req.file = { path: "/uploads/image.jpg" } as any;
    mockCreate.mockRejectedValue(new Error("DB Error"));

    await createExercise(req as Request, res as Response);

    expect(deleteFile).toHaveBeenCalledWith("/uploads/image.jpg");
  });
});
