import request from "supertest";
import app from "../ 
import {Exercise} from "../model/Exercise";
import { jest } from "@jest/globals";

// Mock Mongoose model
jest.mock("../models/Exercise");

describe("PUT /exercise/:exerciseId", () => {
  afterEach(() => {
    jest.clearAllMocks(); // 清理 mock
  });

  test("should update exercise and return updated data", async () => {
    const mockExerciseId = "65d8a6f6a49e8e001f7b1234";
    const mockUpdateData = { name: "Updated Exercise", duration: 60 };
    const mockUpdatedExercise = { _id: mockExerciseId, ...mockUpdateData };

    (Exercise.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedExercise);

    const res = await request(app)
      .put(`/exercise/${mockExerciseId}`)
      .send(mockUpdateData)
      .expect(200);

    expect(res.body).toEqual(mockUpdatedExercise);
    expect(Exercise.findByIdAndUpdate).toHaveBeenCalledWith(
      mockExerciseId,
      mockUpdateData,
      { new: true }
    );
  });

  test("should return 404 if exercise not found", async () => {
    (Exercise.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .put("/exercise/65d8a6f6a49e8e001f7b0000")
      .send({ name: "Nonexistent Exercise" })
      .expect(404);

    expect(res.body).toEqual({ message: "Exercise not found" });
  });

  test("should return 500 on database error", async () => {
    (Exercise.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error("Database error"));

    const res = await request(app)
      .put("/exercise/65d8a6f6a49e8e001f7b5678")
      .send({ name: "Error Exercise" })
      .expect(500);

    expect(res.body).toMatchObject({ message: "Server error" });
  });
});