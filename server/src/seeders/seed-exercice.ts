import Exercise from '../models/Exercise';

async function seedExercise() {
  try {
    await Exercise.sync({ force: true });
    await Exercise.bulkCreate([
      {
        ExerciseName: 'Sit-Ups',
        ExerciseDescription: 'Ce sont des redressements assis',
        ExerciseNumberRepetitionsMin: 10,
        ExerciseNumberRepetitionsMax: 30,
        ExerciseDescriptionURL: 'https://youtu.be/dQw4w9WgXcQ?si=ca1IKvP_pVCkckVi',
      },
      {
        ExerciseName: 'Lie Down',
        ExerciseDescription: 'Pas aussi facile que ça en a l\'air',
        ExerciseNumberRepetitionsMin: 40,
        ExerciseNumberRepetitionsMax: 50,
        ExerciseDescriptionURL: 'https://youtu.be/ojByzJhwVFE',
      },
      {
        ExerciseName: 'Sleeping',
        ExerciseDescription: 'Ne ris pas',
        ExerciseNumberRepetitionsMin: 50,
        ExerciseNumberRepetitionsMax: 60,
        ExerciseDescriptionURL: 'https://youtu.be/dQw4w9WgXcQ?si=ca1IKvP_pVCkckVi',
      },
    ]);
  } catch (error) {
    console.error('Error seeding Exercise:', error);
  }
}




export { seedExercise };
