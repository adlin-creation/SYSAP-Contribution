import request from "supertest";
import app from "../server";
import { Exercise } from "../model/Exercise";
import { jest } from "@jest/globals";

interface IExercise {
  _id: string;
  name: string;
  duration: number;
}

jest.mock("../model/Exercise");

describe("PUT /exercise/:exerciseId", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (Exercise.findByIdAndUpdate as jest.MockedFunction<typeof Exercise.findByIdAndUpdate>)
      .mockImplementation(
        async (_id: string, data: Partial<IExercise>, options: { new: boolean }) => null
      );
  });

  test("should update exercise and return updated data", async () => {
    const mockExerciseId = "65d8a6f6a49e8e001f7b1234";
    const mockUpdateData: Partial<IExercise> = { name: "Updated Exercise", duration: 60 };
    const mockUpdatedExercise: Required<Partial<IExercise>> = {
      _id: mockExerciseId,
      name: mockUpdateData.name ?? "Default Name",
      duration: mockUpdateData.duration ?? 30,
    };

    (Exercise.findByIdAndUpdate as jest.MockedFunction<typeof Exercise.findByIdAndUpdate>)
      .mockResolvedValue(mockUpdatedExercise);

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
    (Exercise.findByIdAndUpdate as jest.MockedFunction<typeof Exercise.findByIdAndUpdate>)
      .mockResolvedValue(null);

    const res = await request(app)
      .put("/exercise/65d8a6f6a49e8e001f7b0000")
      .send({ name: "Nonexistent Exercise" })
      .expect(404);

    expect(res.body).toEqual({ message: "Exercise not found" });
  });

  test("should return 500 on database error", async () => {
    (Exercise.findByIdAndUpdate as jest.MockedFunction<typeof Exercise.findByIdAndUpdate>)
      .mockRejectedValue(new Error("Database error"));

    const res = await request(app)
      .put("/exercise/65d8a6f6a49e8e001f7b5678")
      .send({ name: "Error Exercise" })
      .expect(500);

    expect(res.body).toMatchObject({ message: "Server error" });
  });
});