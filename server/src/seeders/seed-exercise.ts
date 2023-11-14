import Exercise from "../models/Exercise";

async function seedExercise() {
  try {
    await Exercise.sync({ force: true });
    await Exercise.bulkCreate([
      {
        ExerciseName: "Sit-Ups",
        ExerciseDescription: "Ce sont des redressements assis",
        ExerciseNumberRepetitionsMin: 10,
        ExerciseNumberRepetitionsMax: 30,
        ExerciseImageURL: "Exo1.svg",
        ExerciseExplanationVidURL: "Exo2.mp4",
        ExerciseSeanceVidURL: "an URL video",
      },
      {
        ExerciseName: "Lie Down",
        ExerciseDescription: "Pas aussi facile que ça en a l'air",
        ExerciseNumberRepetitionsMin: 40,
        ExerciseNumberRepetitionsMax: 50,
        ExerciseImageURL: "Exo2.svg",
        ExerciseExplanationVidURL: "Exo3.mp4",
        ExerciseSeanceVidURL: "an URL video",
      },
      {
        ExerciseName: "Sleeping",
        ExerciseDescription: "Ne ris pas",
        ExerciseNumberRepetitionsMin: 50,
        ExerciseNumberRepetitionsMax: 60,
        ExerciseImageURL: "Exo3.svg",
        ExerciseExplanationVidURL: "Exo4.mp4",
        ExerciseSeanceVidURL: "an URL video",
      },
    ]);
  } catch (error) {
    console.error("Error seeding Exercise:", error);
  }
}

export { seedExercise };
