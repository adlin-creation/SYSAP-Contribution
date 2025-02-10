import ProgramExerciseSeries from "../models/ProgramExerciseSeries";

async function seedProgramExerciseSeries() {
  try {
    await ProgramExerciseSeries.sync({ force: true });
    await ProgramExerciseSeries.bulkCreate([
      {
        idProgramExerciseSeries: 1,
        ProgramName: "PATH",
        ExerciseSeriesId: 101,
        StartDay: 1,
        EndDay: 14,
      },
      {
        idProgramExerciseSeries: 2,
        ProgramName: "PACE",
        ExerciseSeriesId: 102,
        StartDay: 5,
        EndDay: 20,
      },
      {
        idProgramExerciseSeries: 3,
        ProgramName: "PUSH",
        ExerciseSeriesId: 103,
        StartDay: 10,
        EndDay: 25,
      },
    ]);
  } catch (error) {
    console.error("Error seeding ProgramExerciseSeries:", error);
  }
}

export { seedProgramExerciseSeries };
