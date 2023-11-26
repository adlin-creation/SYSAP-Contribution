import { seedProgram } from './seed-program';
import { seedExercise } from './seed-exercise';
import { seedPatient } from './seed-patient';
import { seedProgramEnrollment } from './seed-programEnrollment';
import { seedProgramExerciseSeries } from './seed-programExerciseSeries';




async function seedAll() {
  await seedProgram();
  await seedExercise();
  await seedPatient();
  await seedProgramEnrollment();
  await seedProgramExerciseSeries();

  // Add more seeders as needed
}

seedAll();