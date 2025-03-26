import { Request, Response } from "express";
import { Evaluation } from "../model/Evaluation";
import { Evaluation_PACE } from "../model/Evaluation_PACE";
import { Evaluation_PATH } from "../model/Evaluation_PATH";
import { Evaluation_MATCH } from "../model/Evaluation_MATCH";
import { Program } from "../model/Program";
import { Patient } from "../model/Patient";
import { sequelize } from "../util/database";
import { Op } from "sequelize";

const {
  createPaceEvaluation,
  getPaceEvaluation,
  getPaceEvaluations,
  updatePaceEvaluation,
  deletePaceEvaluation,
  createMatchEvaluation,
  getMatchEvaluation,
  getMatchEvaluations,
  updateMatchEvaluation,
  deleteMatchEvaluation,
  createPathEvaluation,
  getPathEvaluation,
  getPathEvaluations,
  updatePathEvaluation,
  deletePathEvaluation,
  searchPatients,
} = require("../controller/EvaluationController");

describe("EvaluationController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;
  let mockTransaction: any;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    mockTransaction = {
      commit: jest.fn(),
      rollback: jest.fn(),
    };

    jest.spyOn(sequelize, "transaction").mockResolvedValue(mockTransaction);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Create tests", () => {
    const setupCreateTest = (evaluationType: string) => {
      interface TestScores {
        program: string;
        cardioMusculaire: number;
        equilibre: number;
        total: number;
        mobilite?: number;
      }

      interface TestBody {
        idPatient: number;
        chairTestSupport: string;
        chairTestCount: string;
        balanceFeetTogether: string;
        balanceSemiTandem: string;
        balanceTandem: string;
        walkingTime: string;
        scores: TestScores;
        balanceOneFooted?: string;
        frtSitting?: string | boolean;
        frtDistance?: string;
      }

      const baseBody: TestBody = {
        idPatient: 1,
        chairTestSupport: "with",
        chairTestCount: "5",
        balanceFeetTogether: "30",
        balanceSemiTandem: "25",
        balanceTandem: "20",
        walkingTime: "10",
        scores: {
          program: "MARRON IV",
          cardioMusculaire: 5,
          equilibre: 5,
          total: 15,
        },
      };

      if (evaluationType === "PACE") {
        baseBody.balanceOneFooted = "10";
        baseBody.frtSitting = "sitting";
        baseBody.frtDistance = "15";
        baseBody.scores.mobilite = 5;
      }

      mockReq.body = baseBody;
    };

    const evaluationTypes = [
      {
        method: createPaceEvaluation,
        name: "PACE",
        evaluationModel: Evaluation_PACE,
        idField: "idPACE",
        errorMsg: "Error creating evaluation",
      },
      {
        method: createMatchEvaluation,
        name: "MATCH",
        evaluationModel: Evaluation_MATCH,
        idField: "idPATH",
        errorMsg: "Error creating MATCH evaluation",
      },
      {
        method: createPathEvaluation,
        name: "PATH",
        evaluationModel: Evaluation_PATH,
        idField: "idPATH",
        errorMsg: "Error creating PATH evaluation",
      },
    ];

    for (const {
      method,
      name,
      evaluationModel,
      idField,
      errorMsg,
    } of evaluationTypes) {
      it(`should create a new ${name} evaluation successfully`, async () => {
        setupCreateTest(name);

        const mockProgram = { id: 1, name: "MARRON IV" };
        jest.spyOn(Program, "findOne").mockResolvedValue(mockProgram as any);

        const mockEvaluation = { id: 1, idPatient: 1, idResultProgram: 1 };
        jest
          .spyOn(Evaluation, "create")
          .mockResolvedValue(mockEvaluation as any);

        const mockSpecificEvaluation = { id: 1, [idField]: 1 };
        jest
          .spyOn(evaluationModel, "create")
          .mockResolvedValue(mockSpecificEvaluation as any);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockTransaction.commit).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            evaluation: expect.objectContaining({ id: 1 }),
            scores: expect.any(Object),
            objectifMarche: expect.any(Number),
          })
        );
      });

      it(`should handle the case where program is not found for ${name}`, async () => {
        mockReq.body = {
          scores: {
            program: "PROGRAMME INEXISTANT",
          },
        };

        jest.spyOn(Program, "findOne").mockResolvedValue(null);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockTransaction.rollback).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.stringContaining("Programme"),
            error: expect.any(String),
          })
        );
      });

      it(`should handle database errors during ${name} creation`, async () => {
        setupCreateTest(name);

        const mockProgram = { id: 1, name: "MARRON IV" };
        jest.spyOn(Program, "findOne").mockResolvedValue(mockProgram as any);

        const dbError = new Error("Database error");
        jest.spyOn(Evaluation, "create").mockRejectedValue(dbError);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockTransaction.rollback).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: errorMsg,
            errorDetails: expect.any(String),
            stack: expect.any(String),
          })
        );
      });
    }

    it("should correctly calculate walking objective based on speed", async () => {
      const testCases = [
        { walkingTime: "10", expectedSpeed: 0.4, expectedObjectif: 2 },
        { walkingTime: "5", expectedSpeed: 0.8, expectedObjectif: 4 },
        { walkingTime: "6", expectedSpeed: 4 / 6, expectedObjectif: 3 },
        { walkingTime: "20", expectedSpeed: 0.2, expectedObjectif: 1 },
      ];

      for (const testCase of testCases) {
        jest.clearAllMocks();

        setupCreateTest("PACE");
        mockReq.body.walkingTime = testCase.walkingTime;

        const mockProgram = { id: 1, name: "MARRON IV" };
        jest.spyOn(Program, "findOne").mockResolvedValue(mockProgram as any);

        const mockEvaluation = { id: 1, idPatient: 1, idResultProgram: 1 };
        jest
          .spyOn(Evaluation, "create")
          .mockResolvedValue(mockEvaluation as any);

        const mockPaceEvaluation = {
          id: 1,
          idPACE: 1,
          vitesseDeMarche: 0,
          objectifMarche: 0,
        };

        const createSpy = jest
          .spyOn(Evaluation_PACE, "create")
          .mockResolvedValue(mockPaceEvaluation as any);

        await createPaceEvaluation(
          mockReq as Request,
          mockRes as Response,
          mockNext
        );

        expect(createSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            vitesseDeMarche: testCase.expectedSpeed,
            objectifMarche: testCase.expectedObjectif,
          }),
          expect.any(Object)
        );
      }
    });
  });

  describe("Get tests", () => {
    const setupGetTest = (id = "1") => {
      mockReq.params = { id };
    };

    const singleGetMethods = [
      {
        method: getPaceEvaluation,
        name: "PACE",
        model: Evaluation_PACE,
        modelKey: "Evaluation_PACE",
        idKey: "idPACE",
      },
      {
        method: getMatchEvaluation,
        name: "MATCH",
        model: Evaluation_MATCH,
        modelKey: "Evaluation_MATCH",
        idKey: "idPATH",
      },
      {
        method: getPathEvaluation,
        name: "PATH",
        model: Evaluation_PATH,
        modelKey: "Evaluation_PATH",
        idKey: "idPATH",
      },
    ];

    for (const { method, name, modelKey, idKey } of singleGetMethods) {
      it(`should retrieve a specific ${name} evaluation`, async () => {
        setupGetTest();

        const mockEvaluation = {
          id: 1,
          [modelKey]: {
            [idKey]: 1,
          },
        };

        jest
          .spyOn(Evaluation, "findOne")
          .mockResolvedValue(mockEvaluation as any);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockEvaluation);
      });

      it(`should handle the case where ${name} evaluation is not found`, async () => {
        setupGetTest("999");

        jest.spyOn(Evaluation, "findOne").mockResolvedValue(null);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: "Evaluation not found",
        });
      });

      it(`should handle database errors when retrieving ${name}`, async () => {
        setupGetTest();

        const dbError = new Error(`Database error for ${name}`);
        jest.spyOn(Evaluation, "findOne").mockRejectedValue(dbError);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: "Error loading evaluation from the database",
        });
      });
    }

    const allGetMethods = [
      { method: getPaceEvaluations, name: "PACE", model: Evaluation_PACE },
      { method: getMatchEvaluations, name: "MATCH", model: Evaluation_MATCH },
      { method: getPathEvaluations, name: "PATH", model: Evaluation_PATH },
    ];

    for (const { method, name } of allGetMethods) {
      it(`should retrieve all ${name} evaluations`, async () => {
        const mockEvaluations = [{ id: 1 }, { id: 2 }];

        jest
          .spyOn(Evaluation, "findAll")
          .mockResolvedValue(mockEvaluations as any);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockEvaluations);
      });

      it(`should handle database errors when retrieving all ${name} evaluations`, async () => {
        const dbError = new Error(`Database error for ${name}`);
        jest.spyOn(Evaluation, "findAll").mockRejectedValue(dbError);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: "Error loading evaluations from the database",
        });
      });
    }
  });

  describe("Update tests", () => {
    const setupUpdateTest = () => {
      mockReq.params = { id: "1" };

      interface UpdateScores {
        program: string;
        cardioMusculaire: number;
        equilibre: number;
        total: number;
        mobilite?: number;
      }

      interface UpdateBody {
        chairTestSupport: string;
        chairTestCount: string;
        balanceFeetTogether: string;
        balanceSemiTandem: string;
        balanceTandem: string;
        walkingTime: string;
        scores: UpdateScores;
        balanceOneFooted?: string;
        frtSitting?: boolean;
        frtDistance?: string;
      }

      const updateBody: UpdateBody = {
        chairTestSupport: "with",
        chairTestCount: "6",
        balanceFeetTogether: "30",
        balanceSemiTandem: "25",
        balanceTandem: "20",
        walkingTime: "8",
        scores: {
          program: "MARRON IV",
          cardioMusculaire: 6,
          equilibre: 6,
          total: 12,
        },
      };

      updateBody.balanceOneFooted = "15";
      updateBody.frtSitting = true;
      updateBody.frtDistance = "20";
      updateBody.scores.mobilite = 6;

      mockReq.body = updateBody;
    };

    const updateMethods = [
      {
        method: updatePaceEvaluation,
        name: "PACE",
        findMethod: jest.spyOn(Evaluation_PACE, "findByPk"),
        notFoundMsg: "PACE evaluation not found",
        successMsg: "PACE evaluation updated successfully",
        errorMsg: "Error updating evaluation",
        responseKey: "paceEvaluation",
      },
      {
        method: updateMatchEvaluation,
        name: "MATCH",
        findMethod: jest.spyOn(Evaluation_MATCH, "findOne"),
        notFoundMsg: "MATCH evaluation not found",
        successMsg: "MATCH evaluation updated successfully",
        errorMsg: "Error updating MATCH evaluation",
        responseKey: "pathEvaluation",
      },
      {
        method: updatePathEvaluation,
        name: "PATH",
        findMethod: jest.spyOn(Evaluation_PATH, "findOne"),
        notFoundMsg: "PATH evaluation not found",
        successMsg: "PATH evaluation updated successfully",
        errorMsg: "Error updating PATH evaluation",
        responseKey: "pathEvaluation",
      },
    ];

    for (const {
      method,
      name,
      findMethod,
      notFoundMsg,
      successMsg,
      errorMsg,
      responseKey,
    } of updateMethods) {
      it(`should update an existing ${name} evaluation`, async () => {
        setupUpdateTest();

        const mockEvaluation = {
          id: 1,
          update: jest.fn(),
        };

        const mockSpecificEvaluation = {
          id: 1,
          update: jest.fn(),
        };

        jest
          .spyOn(Evaluation, "findByPk")
          .mockResolvedValue(mockEvaluation as any);
        findMethod.mockResolvedValue(mockSpecificEvaluation as any);

        if (
          name !== "PACE" &&
          mockReq.body &&
          mockReq.body.scores &&
          mockReq.body.scores.program
        ) {
          jest.spyOn(Program, "findOne").mockResolvedValue({
            id: 2,
            name: mockReq.body.scores.program,
          } as any);
        }

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockTransaction.commit).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            evaluation: expect.any(Object),
            [responseKey]: expect.any(Object),
            scores: expect.any(Object),
            message: successMsg,
          })
        );
      });

      it(`should handle the case where ${name} evaluation is not found for update`, async () => {
        setupUpdateTest();

        jest.spyOn(Evaluation, "findByPk").mockResolvedValue(null);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockTransaction.rollback).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: "Evaluation not found",
        });
      });

      it(`should handle the case where specific ${name} evaluation is not found`, async () => {
        setupUpdateTest();

        const mockEvaluation = {
          id: 1,
        };

        jest
          .spyOn(Evaluation, "findByPk")
          .mockResolvedValue(mockEvaluation as any);
        findMethod.mockResolvedValue(null);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockTransaction.rollback).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: notFoundMsg,
        });
      });

      it(`should handle database errors during ${name} update`, async () => {
        setupUpdateTest();

        const mockEvaluation = {
          id: 1,
        };

        const mockSpecificEvaluation = {
          id: 1,
          update: jest
            .fn()
            .mockRejectedValue(new Error(`Update error for ${name}`)),
        };

        jest
          .spyOn(Evaluation, "findByPk")
          .mockResolvedValue(mockEvaluation as any);
        findMethod.mockResolvedValue(mockSpecificEvaluation as any);

        if (
          name !== "PACE" &&
          mockReq.body &&
          mockReq.body.scores &&
          mockReq.body.scores.program
        ) {
          jest.spyOn(Program, "findOne").mockResolvedValue({
            id: 2,
            name: mockReq.body.scores.program,
          } as any);
        }

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockTransaction.rollback).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith(
          expect.objectContaining({
            message: errorMsg,
            errorDetails: expect.any(String),
            stack: expect.any(String),
          })
        );
      });
    }

    const programUpdateMethods = [
      { method: updateMatchEvaluation, name: "MATCH" },
      { method: updatePathEvaluation, name: "PATH" },
    ];

    for (const { method, name } of programUpdateMethods) {
      it(`should handle the case where program to update is not found for ${name}`, async () => {
        setupUpdateTest();

        if (mockReq.body && mockReq.body.scores) {
          mockReq.body.scores.program = "PROGRAMME INEXISTANT";
        }

        const mockEvaluation = {
          id: 1,
        };

        jest
          .spyOn(Evaluation, "findByPk")
          .mockResolvedValue(mockEvaluation as any);

        if (name === "MATCH") {
          jest
            .spyOn(Evaluation_MATCH, "findOne")
            .mockResolvedValue({ id: 1 } as any);
        } else {
          jest
            .spyOn(Evaluation_PATH, "findOne")
            .mockResolvedValue({ id: 1 } as any);
        }

        jest.spyOn(Program, "findOne").mockResolvedValue(null);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockTransaction.rollback).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: expect.stringContaining("Programme"),
        });
      });
    }
  });

  describe("Delete tests", () => {
    const setupDeleteTest = (id = "1") => {
      mockReq.params = { id };
    };

    const deleteMethods = [
      {
        method: deletePaceEvaluation,
        name: "PACE",
        model: Evaluation_PACE,
      },
      {
        method: deleteMatchEvaluation,
        name: "MATCH",
        model: Evaluation_MATCH,
      },
      {
        method: deletePathEvaluation,
        name: "PATH",
        model: Evaluation_PATH,
      },
    ];

    for (const { method, name, model } of deleteMethods) {
      it(`should delete an existing ${name} evaluation`, async () => {
        setupDeleteTest();

        const mockEvaluation = {
          id: 1,
          destroy: jest.fn(),
        };

        jest
          .spyOn(Evaluation, "findByPk")
          .mockResolvedValue(mockEvaluation as any);
        jest.spyOn(model, "destroy").mockResolvedValue(1 as any);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockTransaction.commit).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: "Evaluation deleted",
        });
      });

      it(`should handle the case where ${name} evaluation is not found for deletion`, async () => {
        setupDeleteTest("999");

        jest.spyOn(Evaluation, "findByPk").mockResolvedValue(null);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: "Evaluation not found",
        });
      });

      it(`should handle errors when deleting the main ${name} evaluation`, async () => {
        setupDeleteTest();

        const mockEvaluation = {
          id: 1,
          destroy: jest.fn().mockRejectedValue(new Error("Delete error")),
        };

        jest
          .spyOn(Evaluation, "findByPk")
          .mockResolvedValue(mockEvaluation as any);
        jest.spyOn(model, "destroy").mockResolvedValue(1 as any);

        await method(mockReq as Request, mockRes as Response, mockNext);

        expect(mockTransaction.rollback).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
          message: "Error deleting evaluation",
        });
      });
    }

    it("should handle errors when deleting the specific PACE evaluation", async () => {
      setupDeleteTest();

      const mockEvaluation = {
        id: 1,
        destroy: jest.fn(),
      };

      jest
        .spyOn(Evaluation, "findByPk")
        .mockResolvedValue(mockEvaluation as any);
      jest
        .spyOn(Evaluation_PACE, "destroy")
        .mockRejectedValue(new Error("Delete error"));

      await deletePaceEvaluation(
        mockReq as Request,
        mockRes as Response,
        mockNext
      );

      expect(mockTransaction.rollback).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error deleting evaluation",
      });
    });
  });
});
