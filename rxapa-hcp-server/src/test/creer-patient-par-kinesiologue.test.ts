<<<<<<< HEAD
import { createPatientWithCaregivers } from "../controller/ProgramEnrollementController";
import { Patient } from "../model/Patient";
import { Caregiver } from "../model/Caregiver";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import { Patient_Caregiver } from "../model/Patient_Caregiver";
import { expect, jest } from "@jest/globals";
import { sequelize } from "../util/database"; // Import de sequelize
import { sendEmail } from "../util/unikpass";
jest.setTimeout(50000);
// Mock des modèles Sequelize
jest.mock("../model/Patient");
jest.mock("../model/Caregiver");
jest.mock("../model/ProgramEnrollement");
jest.mock("../model/Patient_Caregiver");
jest.mock("../util/unikpass", () => ({
  sendEmail: jest.fn(),
  generateCode: jest.fn(() => "123456"),
}));

// Mock de sequelize.transaction
(sequelize.transaction as jest.Mock) = jest.fn(() => ({
  commit: jest.fn(),
  rollback: jest.fn(),
}));

describe("createPatientWithCaregivers", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      body: {
        patientData: {
          email: "patient@example.com",
          firstName: "John",
          lastName: "Doe",
        },
        caregivers: [
          {
            email: "caregiver1@example.com",
            program: 1,
            programStart: "2024-01-01",
            programEnd: "2024-12-31",
          },
        ],
      },
    };

    res = {
      statusCode: 500,
      json: jest.fn(),
      status: function (code: number) {
        this.statusCode = code;
        return this;
      },
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Réinitialiser les mocks après chaque test
  });

  it("should create a patient with one caregiver successfully", async () => {
    // Mock des méthodes de recherche pour simuler qu'aucun patient ou soignant n'existe
    (
      Patient.findOne as jest.MockedFunction<typeof Patient.findOne>
    ).mockResolvedValue(null);
    (
      Caregiver.findOne as jest.MockedFunction<typeof Caregiver.findOne>
    ).mockResolvedValue(null);

    // Mock des méthodes de création
    (
      Patient.create as jest.MockedFunction<typeof Patient.create>
    ).mockResolvedValue({
      id: 1,
      ...req.body.patientData,
      status: "waiting",
      numberOfPrograms: 1,
    });

    (
      Caregiver.create as jest.MockedFunction<typeof Caregiver.create>
    ).mockResolvedValue({
      id: 2,
      ...req.body.caregivers[0],
    });

    (
      ProgramEnrollement.create as jest.MockedFunction<
        typeof ProgramEnrollement.create
      >
    ).mockResolvedValue({
      id: 3,
    });

    (
      Patient_Caregiver.create as jest.MockedFunction<
        typeof Patient_Caregiver.create
      >
    ).mockResolvedValue({});

    // Appel de la fonction à tester
    await createPatientWithCaregivers(req, res, next);

    // Vérifications
    expect(Patient_Caregiver.create).toHaveBeenCalledWith(
      expect.objectContaining({
        PatientId: 1, // Utilisez les propriétés reçues
        CaregiverId: 2,
        ProgramEnrollementId: 3,
        date: expect.any(Date), // Utilisez expect.any pour les dates dynamiques
      }),
      { transaction: expect.any(Object) } // Ignorez les détails de la transaction
    );

    expect(res.statusCode).toBe(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        patient: expect.objectContaining({
          email: "patient@example.com",
          firstName: "John",
          lastName: "Doe",
        }),
      })
    );
    //  verifier l'appel du nodemailer
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it("should create a patient with two caregivers successfully", async () => {
    // Simuler une requête avec 2 caregivers
    req.body.caregivers = [
      {
        email: "caregiver1@example.com",
        program: 1,
        programStart: "2024-01-01",
        programEnd: "2024-12-31",
      },
      {
        email: "caregiver2@example.com",
        program: 2,
        programStart: "2024-01-01",
        programEnd: "2024-12-31",
      },
    ];

    // Mock des méthodes de recherche pour simuler qu'aucun patient ou soignant n'existe
    (
      Patient.findOne as jest.MockedFunction<typeof Patient.findOne>
    ).mockResolvedValue(null);
    (
      Caregiver.findOne as jest.MockedFunction<typeof Caregiver.findOne>
    ).mockResolvedValue(null);

    // Mock des méthodes de création
    (
      Patient.create as jest.MockedFunction<typeof Patient.create>
    ).mockResolvedValue({
      id: 1,
      ...req.body.patientData,
      status: "waiting",
      numberOfPrograms: 2, // Nombre de programmes distincts
    });

    (Caregiver.create as jest.MockedFunction<typeof Caregiver.create>)
      .mockResolvedValueOnce({ id: 2, ...req.body.caregivers[0] }) // Premier caregiver
      .mockResolvedValueOnce({ id: 3, ...req.body.caregivers[1] }); // Deuxième caregiver

    (
      ProgramEnrollement.create as jest.MockedFunction<
        typeof ProgramEnrollement.create
      >
    )
      .mockResolvedValueOnce({ id: 4, ProgramId: 1, PatientId: 1 }) // Premier programme
      .mockResolvedValueOnce({ id: 5, ProgramId: 2, PatientId: 1 }); // Deuxième programme

    (
      Patient_Caregiver.create as jest.MockedFunction<
        typeof Patient_Caregiver.create
      >
    )
      .mockResolvedValueOnce({}) // Association pour le premier caregiver
      .mockResolvedValueOnce({}); // Association pour le deuxième caregiver

    // Appel de la fonction à tester
    await createPatientWithCaregivers(req, res, next);

    // Vérifications
    // 1. Vérifier que le patient est créé avec le bon nombre de programmes
    expect(Patient.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "patient@example.com",
        firstName: "John",
        lastName: "Doe",
        status: "waiting",
        numberOfPrograms: 2, // Nombre de programmes distincts
      }),
      { transaction: expect.any(Object) }
    );

    // 2. Vérifier que les deux caregivers sont créés
    expect(Caregiver.create).toHaveBeenCalledTimes(2);
    expect(Caregiver.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "caregiver1@example.com",
        program: 1,
        programStart: "2024-01-01",
        programEnd: "2024-12-31",
      }),
      { transaction: expect.any(Object) }
    );
    expect(Caregiver.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "caregiver2@example.com",
        program: 2,
        programStart: "2024-01-01",
        programEnd: "2024-12-31",
      }),
      { transaction: expect.any(Object) }
    );

    // 3. Vérifier que les enregistrements de programme sont créés
    expect(ProgramEnrollement.create).toHaveBeenCalledTimes(2);
    expect(ProgramEnrollement.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ProgramId: 1,
        PatientId: 1,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        programEnrollementCode: expect.any(String), // Code dynamique
      }),
      { transaction: expect.any(Object) }
    );
    expect(ProgramEnrollement.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ProgramId: 2,
        PatientId: 1,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        programEnrollementCode: expect.any(String), // Code dynamique
      }),
      { transaction: expect.any(Object) }
    );

    // 4. Vérifier que les associations Patient_Caregiver sont créées
    expect(Patient_Caregiver.create).toHaveBeenCalledTimes(2);
    expect(Patient_Caregiver.create).toHaveBeenCalledWith(
      expect.objectContaining({
        PatientId: 1,
        CaregiverId: 2,
        ProgramEnrollementId: 4, // ID du premier programme
        date: expect.any(Date), // Date dynamique
      }),
      { transaction: expect.any(Object) }
    );
    expect(Patient_Caregiver.create).toHaveBeenCalledWith(
      expect.objectContaining({
        PatientId: 1,
        CaregiverId: 3,
        ProgramEnrollementId: 5, // ID du deuxième programme
        date: expect.any(Date), // Date dynamique
      }),
      { transaction: expect.any(Object) }
    );

    // 5. Vérifier la réponse
    expect(res.statusCode).toBe(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        patient: expect.objectContaining({
          email: "patient@example.com",
          firstName: "John",
          lastName: "Doe",
        }),
        enrollments: expect.arrayContaining([
          expect.objectContaining({ ProgramId: 1, PatientId: 1 }),
          expect.objectContaining({ ProgramId: 2, PatientId: 1 }),
        ]),
        caregivers: expect.arrayContaining([
          expect.objectContaining({ email: "caregiver1@example.com" }),
          expect.objectContaining({ email: "caregiver2@example.com" }),
        ]),
      })
    );

    // 6. verifier l'appel du nodemailer
    expect(sendEmail).toHaveBeenCalledTimes(3);
  });

  it("should return 409 if the patient already exists", async () => {
    // Mock de la méthode findOne pour simuler un patient existant
    (
      Patient.findOne as jest.MockedFunction<typeof Patient.findOne>
    ).mockResolvedValue({
      id: 1,
      email: "patient@example.com",
      firstName: "John",
      lastName: "Doe",
    });

    // Appel de la fonction à tester
    await createPatientWithCaregivers(req, res, next);

    // Vérifications
    expect(Patient.findOne).toHaveBeenCalledWith({
      where: { email: "patient@example.com" },
    });
    expect(res.statusCode).toBe(409);
    expect(res.json).toHaveBeenCalledWith({
      message: `error_existing_patient_email: ${req.body.patientData.email}`,
    });
  });

  it("should return 409 if the caregiver already exists", async () => {
    // Mock de la méthode findOne pour simuler un soignant existant
    (
      Patient.findOne as jest.MockedFunction<typeof Patient.findOne>
    ).mockResolvedValue(null);
    (
      Caregiver.findOne as jest.MockedFunction<typeof Caregiver.findOne>
    ).mockResolvedValue({
      id: 2,
      email: "caregiver1@example.com",
    });

    // Appel de la fonction à tester
    await createPatientWithCaregivers(req, res, next);

    // Vérifications
    expect(Caregiver.findOne).toHaveBeenCalledWith({
      where: { email: "caregiver1@example.com" },
    });
    expect(res.statusCode).toBe(409);
    expect(res.json).toHaveBeenCalledWith({
      message: `error_existing_caregiver_email: ${req.body.caregivers[0].email}`,
    });
  });

  it("should handle error when creating patient", async () => {
    // Mock de la méthode findOne pour simuler qu'aucun patient ou soignant n'existe
    (
      Patient.findOne as jest.MockedFunction<typeof Patient.findOne>
    ).mockResolvedValue(null);
    (
      Caregiver.findOne as jest.MockedFunction<typeof Caregiver.findOne>
    ).mockResolvedValue(null);

    // Mock de la méthode create pour simuler une erreur
    (
      Patient.create as jest.MockedFunction<typeof Patient.create>
    ).mockRejectedValue(new Error("Patient creation failed"));

    // Appel de la fonction à tester
    await createPatientWithCaregivers(req, res, next);

    // Vérifications
    expect(Patient.create).toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Patient creation failed",
      message: "error_creating_patient_with_caregivers",
    });
  });
});
=======
import { createPatientWithCaregivers } from "../controller/ProgramEnrollementController";
import { Patient } from "../model/Patient";
import { Caregiver } from "../model/Caregiver";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import { Patient_Caregiver } from "../model/Patient_Caregiver";
import { expect, jest } from "@jest/globals";
import { sequelize } from "../util/database"; // Import de sequelize
import { sendEmail } from "../util/unikpass";
jest.setTimeout(50000);
// Mock des modèles Sequelize
jest.mock("../model/Patient");
jest.mock("../model/Caregiver");
jest.mock("../model/ProgramEnrollement");
jest.mock("../model/Patient_Caregiver");
jest.mock("../util/unikpass", () => ({
  sendEmail: jest.fn(),
  generateCode: jest.fn(() => "123456"),
}));

// Mock de sequelize.transaction
(sequelize.transaction as jest.Mock) = jest.fn(() => ({
  commit: jest.fn(),
  rollback: jest.fn(),
}));

describe("createPatientWithCaregivers", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      body: {
        patientData: {
          email: "patient@example.com",
          firstName: "John",
          lastName: "Doe",
        },
        caregivers: [
          {
            email: "caregiver1@example.com",
            program: 1,
            programStart: "2024-01-01",
            programEnd: "2024-12-31",
          },
        ],
      },
    };

    res = {
      statusCode: 500,
      json: jest.fn(),
      status: function (code: number) {
        this.statusCode = code;
        return this;
      },
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Réinitialiser les mocks après chaque test
  });

  it("should create a patient with one caregiver successfully", async () => {
    // Mock des méthodes de recherche pour simuler qu'aucun patient ou soignant n'existe
    (
      Patient.findOne as jest.MockedFunction<typeof Patient.findOne>
    ).mockResolvedValue(null);
    (
      Caregiver.findOne as jest.MockedFunction<typeof Caregiver.findOne>
    ).mockResolvedValue(null);

    // Mock des méthodes de création
    (
      Patient.create as jest.MockedFunction<typeof Patient.create>
    ).mockResolvedValue({
      id: 1,
      ...req.body.patientData,
      status: "waiting",
      numberOfPrograms: 1,
    });

    (
      Caregiver.create as jest.MockedFunction<typeof Caregiver.create>
    ).mockResolvedValue({
      id: 2,
      ...req.body.caregivers[0],
    });

    (
      ProgramEnrollement.create as jest.MockedFunction<
        typeof ProgramEnrollement.create
      >
    ).mockResolvedValue({
      id: 3,
    });

    (
      Patient_Caregiver.create as jest.MockedFunction<
        typeof Patient_Caregiver.create
      >
    ).mockResolvedValue({});

    // Appel de la fonction à tester
    await createPatientWithCaregivers(req, res, next);

    // Vérifications
    expect(Patient_Caregiver.create).toHaveBeenCalledWith(
      expect.objectContaining({
        PatientId: 1, // Utilisez les propriétés reçues
        CaregiverId: 2,
        ProgramEnrollementId: 3,
        date: expect.any(Date), // Utilisez expect.any pour les dates dynamiques
      }),
      { transaction: expect.any(Object) } // Ignorez les détails de la transaction
    );

    expect(res.statusCode).toBe(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        patient: expect.objectContaining({
          email: "patient@example.com",
          firstName: "John",
          lastName: "Doe",
        }),
      })
    );
    //  verifier l'appel du nodemailer
    expect(sendEmail).toHaveBeenCalledTimes(2);
  });

  it("should create a patient with two caregivers successfully", async () => {
    // Simuler une requête avec 2 caregivers
    req.body.caregivers = [
      {
        email: "caregiver1@example.com",
        program: 1,
        programStart: "2024-01-01",
        programEnd: "2024-12-31",
      },
      {
        email: "caregiver2@example.com",
        program: 2,
        programStart: "2024-01-01",
        programEnd: "2024-12-31",
      },
    ];

    // Mock des méthodes de recherche pour simuler qu'aucun patient ou soignant n'existe
    (
      Patient.findOne as jest.MockedFunction<typeof Patient.findOne>
    ).mockResolvedValue(null);
    (
      Caregiver.findOne as jest.MockedFunction<typeof Caregiver.findOne>
    ).mockResolvedValue(null);

    // Mock des méthodes de création
    (
      Patient.create as jest.MockedFunction<typeof Patient.create>
    ).mockResolvedValue({
      id: 1,
      ...req.body.patientData,
      status: "waiting",
      numberOfPrograms: 2, // Nombre de programmes distincts
    });

    (Caregiver.create as jest.MockedFunction<typeof Caregiver.create>)
      .mockResolvedValueOnce({ id: 2, ...req.body.caregivers[0] }) // Premier caregiver
      .mockResolvedValueOnce({ id: 3, ...req.body.caregivers[1] }); // Deuxième caregiver

    (
      ProgramEnrollement.create as jest.MockedFunction<
        typeof ProgramEnrollement.create
      >
    )
      .mockResolvedValueOnce({ id: 4, ProgramId: 1, PatientId: 1 }) // Premier programme
      .mockResolvedValueOnce({ id: 5, ProgramId: 2, PatientId: 1 }); // Deuxième programme

    (
      Patient_Caregiver.create as jest.MockedFunction<
        typeof Patient_Caregiver.create
      >
    )
      .mockResolvedValueOnce({}) // Association pour le premier caregiver
      .mockResolvedValueOnce({}); // Association pour le deuxième caregiver

    // Appel de la fonction à tester
    await createPatientWithCaregivers(req, res, next);

    // Vérifications
    // 1. Vérifier que le patient est créé avec le bon nombre de programmes
    expect(Patient.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "patient@example.com",
        firstName: "John",
        lastName: "Doe",
        status: "waiting",
        numberOfPrograms: 2, // Nombre de programmes distincts
      }),
      { transaction: expect.any(Object) }
    );

    // 2. Vérifier que les deux caregivers sont créés
    expect(Caregiver.create).toHaveBeenCalledTimes(2);
    expect(Caregiver.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "caregiver1@example.com",
        program: 1,
        programStart: "2024-01-01",
        programEnd: "2024-12-31",
      }),
      { transaction: expect.any(Object) }
    );
    expect(Caregiver.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "caregiver2@example.com",
        program: 2,
        programStart: "2024-01-01",
        programEnd: "2024-12-31",
      }),
      { transaction: expect.any(Object) }
    );

    // 3. Vérifier que les enregistrements de programme sont créés
    expect(ProgramEnrollement.create).toHaveBeenCalledTimes(2);
    expect(ProgramEnrollement.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ProgramId: 1,
        PatientId: 1,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        programEnrollementCode: expect.any(String), // Code dynamique
      }),
      { transaction: expect.any(Object) }
    );
    expect(ProgramEnrollement.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ProgramId: 2,
        PatientId: 1,
        startDate: "2024-01-01",
        endDate: "2024-12-31",
        programEnrollementCode: expect.any(String), // Code dynamique
      }),
      { transaction: expect.any(Object) }
    );

    // 4. Vérifier que les associations Patient_Caregiver sont créées
    expect(Patient_Caregiver.create).toHaveBeenCalledTimes(2);
    expect(Patient_Caregiver.create).toHaveBeenCalledWith(
      expect.objectContaining({
        PatientId: 1,
        CaregiverId: 2,
        ProgramEnrollementId: 4, // ID du premier programme
        date: expect.any(Date), // Date dynamique
      }),
      { transaction: expect.any(Object) }
    );
    expect(Patient_Caregiver.create).toHaveBeenCalledWith(
      expect.objectContaining({
        PatientId: 1,
        CaregiverId: 3,
        ProgramEnrollementId: 5, // ID du deuxième programme
        date: expect.any(Date), // Date dynamique
      }),
      { transaction: expect.any(Object) }
    );

    // 5. Vérifier la réponse
    expect(res.statusCode).toBe(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        patient: expect.objectContaining({
          email: "patient@example.com",
          firstName: "John",
          lastName: "Doe",
        }),
        enrollments: expect.arrayContaining([
          expect.objectContaining({ ProgramId: 1, PatientId: 1 }),
          expect.objectContaining({ ProgramId: 2, PatientId: 1 }),
        ]),
        caregivers: expect.arrayContaining([
          expect.objectContaining({ email: "caregiver1@example.com" }),
          expect.objectContaining({ email: "caregiver2@example.com" }),
        ]),
      })
    );

    // 6. verifier l'appel du nodemailer
    expect(sendEmail).toHaveBeenCalledTimes(3);
  });

  it("should return 409 if the patient already exists", async () => {
    // Mock de la méthode findOne pour simuler un patient existant
    (
      Patient.findOne as jest.MockedFunction<typeof Patient.findOne>
    ).mockResolvedValue({
      id: 1,
      email: "patient@example.com",
      firstName: "John",
      lastName: "Doe",
    });

    // Appel de la fonction à tester
    await createPatientWithCaregivers(req, res, next);

    // Vérifications
    expect(Patient.findOne).toHaveBeenCalledWith({
      where: { email: "patient@example.com" },
    });
    expect(res.statusCode).toBe(409);
    expect(res.json).toHaveBeenCalledWith({
      message: `error_existing_patient_email: ${req.body.patientData.email}`,
    });
  });

  it("should return 409 if the caregiver already exists", async () => {
    // Mock de la méthode findOne pour simuler un soignant existant
    (
      Patient.findOne as jest.MockedFunction<typeof Patient.findOne>
    ).mockResolvedValue(null);
    (
      Caregiver.findOne as jest.MockedFunction<typeof Caregiver.findOne>
    ).mockResolvedValue({
      id: 2,
      email: "caregiver1@example.com",
    });

    // Appel de la fonction à tester
    await createPatientWithCaregivers(req, res, next);

    // Vérifications
    expect(Caregiver.findOne).toHaveBeenCalledWith({
      where: { email: "caregiver1@example.com" },
    });
    expect(res.statusCode).toBe(409);
    expect(res.json).toHaveBeenCalledWith({
      message: `error_existing_caregiver_email: ${req.body.caregivers[0].email}`,
    });
  });

  it("should handle error when creating patient", async () => {
    // Mock de la méthode findOne pour simuler qu'aucun patient ou soignant n'existe
    (
      Patient.findOne as jest.MockedFunction<typeof Patient.findOne>
    ).mockResolvedValue(null);
    (
      Caregiver.findOne as jest.MockedFunction<typeof Caregiver.findOne>
    ).mockResolvedValue(null);

    // Mock de la méthode create pour simuler une erreur
    (
      Patient.create as jest.MockedFunction<typeof Patient.create>
    ).mockRejectedValue(new Error("Patient creation failed"));

    // Appel de la fonction à tester
    await createPatientWithCaregivers(req, res, next);

    // Vérifications
    expect(Patient.create).toHaveBeenCalled();
    expect(res.statusCode).toBe(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Patient creation failed",
      message: "error_creating_patient_with_caregivers",
    });
  });
});
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
