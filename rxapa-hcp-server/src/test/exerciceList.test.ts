import { getExercises } from "../controller/ExerciseController";
import { Exercise } from "../model/Exercise";
import { expect, jest } from "@jest/globals";
import { Request, Response } from "express";

jest.mock("../model/Exercise", () => {
  return {
    Exercise: {
      findAll: jest.fn(),
    },
  };
});

describe("getExercises", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
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
  });

  it("Should return a list of exercises successfully", async () => {
    const mockExercises = [
      {
        id: 1,
        name: "Push-up",
        category: "Force",
        fitnessLevel: "Intermediare",
        status: "active",
      },
      {
        id: 2,
        name: "Pull-up",
        category: "Force",
        fitnessLevel: "Avancé",
        status: "active",
      },
    ];

    Exercise.findAll.mockResolvedValue(mockExercises);

    await getExercises(req as Request, res as Response);

    expect(Exercise.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockExercises);
  });

  it("Should handle error when fetching exercises", async () => {
    const errorMessage = "Error fetching exercises";
    Exercise.findAll.mockRejectedValue(new Error(errorMessage));

    await getExercises(req as Request, res as Response);

    expect(Exercise.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "error_loading_exercises",
      error: errorMessage,
    });
  });
});
