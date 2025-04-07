const programController = require("../controller/ProgramController");
import { Program } from "../model/Program";
import { ProgramSession } from "../model/ProgramSession";
import { expect, jest } from "@jest/globals";
import { Request, Response } from "express";
import { Op } from "sequelize";

jest.mock("../model/Program", () => ({
  Program: {
    findAll: jest.fn(),
  },
}));

jest.mock("../model/ProgramSession", () => ({
  ProgramSession: {
    findAll: jest.fn(),
  },
}));

const mockFindAllPrograms = Program.findAll;
const mockFindAllSessions = ProgramSession.findAll;

describe("searchPrograms", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { query: {} };
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

  it("Should return programs matching name filter", async () => {
    req.query = { name: "Yoga" };

    const mockPrograms = [
      {
        id: 1,
        name: "Yoga Program",
        duration: 30,
        image: "https://example.com/yoga.jpg",
        sessions: [{ id: 1, name: "Session 1" }],
      },
    ];
    mockFindAllPrograms.mockResolvedValue(mockPrograms);

    const handler = programController.searchPrograms;
    await handler(req as Request, res as Response, jest.fn());

    expect(mockFindAllPrograms).toHaveBeenCalledWith({
      where: { name: { [Op.iLike]: "%Yoga%" } },
    });

    expect(res.json).toHaveBeenCalledWith(mockPrograms);
  });

  it("Should search by only duration_unit", async () => {
    req.query = { duration_unit: "days" };
    mockFindAllPrograms.mockResolvedValue([{ id: 4 }]);

    await programController.searchPrograms(
      req as Request,
      res as Response,
      jest.fn()
    );
    expect(mockFindAllPrograms).toHaveBeenCalledWith({
      where: { duration_unit: "days" },
    });
    expect(res.json).toHaveBeenCalledWith([{ id: 4 }]);
  });

  it("Should search by description_keywords", async () => {
    req.query = { description_keywords: "relax" };
    mockFindAllPrograms.mockResolvedValue([{ id: 5 }]);

    await programController.searchPrograms(
      req as Request,
      res as Response,
      jest.fn()
    );
    expect(mockFindAllPrograms).toHaveBeenCalledWith({
      where: { description: { [Op.iLike]: "%relax%" } },
    });
    expect(res.json).toHaveBeenCalledWith([{ id: 5 }]);
  });

  it("Should return 404 if no program found", async () => {
    req.query = { name: "NonExistent" };
    mockFindAllPrograms.mockResolvedValue([]);

    await programController.searchPrograms(
      req as Request,
      res as Response,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "error_no_program_found",
    });
  });

  it("Should return 500 on internal server error", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockFindAllPrograms.mockRejectedValue(new Error("DB ERROR"));

    await programController.searchPrograms(
      req as Request,
      res as Response,
      jest.fn()
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "error_searching_programs",
    });

    jest.restoreAllMocks();
  });
});
