import ProgramEnrollment from "../models/ProgramEnrollment";

async function seedProgramEnrollment() {
  try {
    await ProgramEnrollment.sync({ force: true });
    await ProgramEnrollment.bulkCreate([
      {
        PatientId: 2,
        ProgramName: "PATH",
        ProgramEnrollmentDate: "2022-12-26",
        ProgramStartDate: "2023-04-25",
        ProgramEnrollmentCode: "BLK-06",
      },
      {
        PatientId: 3,
        ProgramName: "PACE",
        ProgramEnrollmentDate: "2023-02-14",
        ProgramStartDate: "2023-02-14",
        ProgramEnrollmentCode: "LMD-62",
      },
      {
        PatientId: 4,
        ProgramName: "PUSH",
        ProgramEnrollmentDate: "2023-10-22",
        ProgramStartDate: "2023-02-19",
        ProgramEnrollmentCode: "RUF-40",
      },
    ]);
  } catch (error) {
    console.error("Error seeding ProgramEnrollment:", error);
  }
}

export { seedProgramEnrollment };
