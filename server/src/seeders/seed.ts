import { seedProgram } from './seed-program';
import { seedExercise } from './seed-exercice';


async function seedAll() {
    await seedProgram();
    await seedExercise();

  // Add more seeders as needed
}

seedAll();