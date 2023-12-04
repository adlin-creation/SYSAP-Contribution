import Patient from "../models/Patient";

async function seedPatient() {
  try {
    await Patient.sync({ force: true }); // "if table exist then drop": false
    await Patient.bulkCreate([
      {
        PatientFirstName: "John",
        PatientLastName: "Doe",
        Email: "john.doe@example.com",
        Password: "$2a$10$iZeeqCuRjR24msvzcKUVqehjTByTDAtxXzxGIO6LEcq1ne8CE9u5G", //qwe
      },
      {
        PatientFirstName: "Jane",
        PatientLastName: "Smith",
        Email: "jane.smith@example.com",
        Password: "$2a$10$iZeeqCuRjR24msvzcKUVqehjTByTDAtxXzxGIO6LEcq1ne8CE9u5G", //qwe
      },
      {
        PatientFirstName: "Alice",
        PatientLastName: "Johnson",
        Email: "alice.johnson@example.com",
        Password: "$2a$10$iZeeqCuRjR24msvzcKUVqehjTByTDAtxXzxGIO6LEcq1ne8CE9u5G", //qwe
      },
      {
        PatientFirstName: "Bob",
        PatientLastName: "Johnson",
        Email: "bob.johnson@example.com",
        Password: "$2a$10$iZeeqCuRjR24msvzcKUVqehjTByTDAtxXzxGIO6LEcq1ne8CE9u5G", //qwe
      },
    ]);
  } catch (error) {
    console.error("Error seeding Patient:", error);
  }
}

export { seedPatient };
