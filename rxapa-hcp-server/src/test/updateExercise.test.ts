import request from "supertest";
import app from "../server";
import { Exercise } from "../model/Exercise";
import { jest } from "@jest/globals";

jest.mock("../model/Exercise");

describe("PUT /exercise/:exerciseId", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should update exercise and return updated data", async () => {
    const mockExerciseId = "65d8a6f6a49e8e001f7b1234";
    const mockUpdateData = { name: "Updated Exercise", duration: 60 };
    const mockUpdatedExercise = { _id: mockExerciseId, ...mockUpdateData };

    jest.spyOn(Exercise, "findByIdAndUpdate").mockResolvedValue(mockUpdatedExercise);

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
    jest.spyOn(Exercise, "findByIdAndUpdate").mockResolvedValue(null);

    const res = await request(app)
      .put("/exercise/65d8a6f6a49e8e001f7b0000")
      .send({ name: "Nonexistent Exercise" })
      .expect(404);

    expect(res.body).toEqual({ message: "Exercise not found" });
  });

  test("should return 500 on database error", async () => {
    jest.spyOn(Exercise, "findByIdAndUpdate").mockRejectedValue(
      new Error("Database error")
    );

    const res = await request(app)
      .put("/exercise/65d8a6f6a49e8e001f7b5678")
      .send({ name: "Error Exercise" })
      .expect(500);

    expect(res.body).toMatchObject({ message: "Server error" });
  });
});