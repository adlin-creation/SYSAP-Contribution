import Program from '../models/Program';

async function seedProgram() {
  try {
    await Program.sync({ force: true });
    await Program.bulkCreate([
      {
        ProgramName: 'PACE',
        ProgramDescription: 'Ceci est le programme PACE',
        ProgramDuration: 60,
      },
      {
        ProgramName: 'PATH',
        ProgramDescription: 'Ceci est le programme PATH',
        ProgramDuration: 60,
      },
    ]);
  } catch (error) {
    console.error('Error seeding Program:', error);
  }
}
seedProgram()



export { seedProgram };