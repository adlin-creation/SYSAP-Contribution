import { createExercise } from "../controller/ExerciseController";
import { Exercise } from "../model/Exercise";
import { expect, jest } from "@jest/globals";
import { Request, Response } from "express";
import { Readable } from "stream";
import { UniqueConstraintError } from "sequelize";

jest.mock("../util/file", () => ({
  deleteFile: jest.fn(),
}));

jest.mock("../model/Exercise", () => {
    return {
        Exercise: {
            create: jest.fn(),
            findOne: jest.fn(),
        },
    };
});

jest.mock("../util/file", () => ({
    deleteFile: jest.fn(),
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
                path: "/uploads/image.jpg",
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
        req.body.name = "";

        await createExercise(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: "Tous les champs obligatoires doivent être remplis !",
        });
    });

    it("Should handle error when creating exercise", async () => {
        mockCreate.mockRejectedValue(new Error("Exercise creation failed"));

        await createExercise(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Erreur lors de la création de l'exercice.",
            error: "Exercise creation failed",
        });
    });
});