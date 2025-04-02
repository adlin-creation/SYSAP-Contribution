import { updateExercise } from "../controller/ExerciseController";
import { Exercise } from "../model/Exercise";
import { Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";

jest.mock("../model/Exercise");

describe("updateExercise", () => {
  let req: Request;
  let res: Response;
  let mockExercise: any;

  beforeEach(() => {
    mockExercise = {
      key: "ex123",
      name: "Push-up",
      description: "Description originale",
      category: "strength",
      fitnessLevel: "beginner",
      videoUrl: "https://www.youtube.com/watch?v=valid",
      update: jest.fn().mockResolvedValue(true)
    };

    (Exercise.findOne as jest.Mock).mockResolvedValue(mockExercise);
    
    req = {
      params: { exerciseKey: "ex123" },
      body: {}
    } as unknown as Request;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update all exercise fields successfully", async () => {
    req.body = {
      name: "Push-up modifié",
      description: "Nouvelle description",
      category: "endurance",
      fitnessLevel: "intermediate",
      videoUrl: "https://www.youtube.com/watch?v=newvalid"
    };

    await updateExercise(req, res);

    expect(mockExercise.update).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Exercice mis à jour avec succès."
    });
  });

  it("should update only the fitness level when provided", async () => {
    req.body = { fitnessLevel: "advanced" };

    await updateExercise(req, res);

    expect(mockExercise.update).toHaveBeenCalledWith({
      name: mockExercise.name,
      description: mockExercise.description,
      category: mockExercise.category,
      fitnessLevel: "advanced",
      videoUrl: mockExercise.videoUrl
    });
  });

  it("should update only the category when provided", async () => {
    req.body = { category: "endurance" };

    await updateExercise(req, res);

    expect(mockExercise.update).toHaveBeenCalledWith({
      name: mockExercise.name,
      description: mockExercise.description,
      category: "endurance",
      fitnessLevel: mockExercise.fitnessLevel,
      videoUrl: mockExercise.videoUrl
    });
  });

  it("should update only the description when provided", async () => {
    req.body = { description: "test" };

    await updateExercise(req, res);

    expect(mockExercise.update).toHaveBeenCalledWith({
      name: mockExercise.name,
      description: "test",
      category: mockExercise.category,
      fitnessLevel: mockExercise.fitnessLevel,
      videoUrl: mockExercise.videoUrl
    });
  });
  it("should update only the status when provided", async () => {
    req.body = { status: "inactive" };

    await updateExercise(req, res);

    expect(mockExercise.update).toHaveBeenCalledWith({
      name: mockExercise.name,
      description: mockExercise.description,
      category: mockExercise.category,
      fitnessLevel: mockExercise.fitnessLevel,
      videoUrl: mockExercise.videoUrl,
      status: "inactive"
    });
  });
  
  it("should return 409 when exercise name already exists", async () => {
    const error = new UniqueConstraintError({ message: "Duplicate name" });
    mockExercise.update.mockRejectedValue(error);

    req.body = { name: "Nom existant" };

    await updateExercise(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Un exercice avec ce nom existe déjà !"
    });
  });

  it("should return 500 when database update fails", async () => {
    const error = new Error("Erreur DB");
    mockExercise.update.mockRejectedValue(error);

    req.body = { name: "Nouveau nom" };

    await updateExercise(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erreur lors de la mise à jour de l'exercice.",
      error: "Erreur DB"
    });
  });
});