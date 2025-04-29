<<<<<<< HEAD
//
import { deleteCaregiver } from "../controller/CaregiverController";
import { Caregiver } from "../model/Caregiver";
import { Patient_Caregiver } from "../model/Patient_Caregiver";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import { Patient } from "../model/Patient";
import { sequelize } from "../util/database";
import { jest } from "@jest/globals";

// Mock des modèles et de la transaction Sequelize
jest.mock("../model/Caregiver");
jest.mock("../model/Patient_Caregiver");
jest.mock("../model/ProgramEnrollement");
jest.mock("../model/Patient");

(sequelize.transaction as jest.Mock) = jest.fn(() => ({
  commit: jest.fn(),
  rollback: jest.fn(),
}));

describe("deleteCaregiver", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = { params: { id: "1" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Mock des données
    const caregiver = { id: 1, destroy: jest.fn() };
    const patient_Caregiver = {
      CaregiverId: 1,
      ProgramEnrollementId: 2,
      destroy: jest.fn(),
    };
    const program_Enrollement = {
      id: 2,
      PatientId: 3,
      ProgramId: 5,
      destroy: jest.fn(),
    };
    const patient = {
      id: 3,
      numberOfCaregivers: 2,
      numberOfPrograms: 2,
      save: jest.fn(),
    };
    const programs_Enrollements_patient = [
      { dataValues: { ProgramId: 5 } },
      { dataValues: { ProgramId: 4 } },
    ];
    (
      Caregiver.findByPk as jest.MockedFunction<typeof Caregiver.findByPk>
    ).mockResolvedValue(caregiver);
    (
      Patient_Caregiver.findOne as jest.MockedFunction<
        typeof Patient_Caregiver.findOne
      >
    ).mockResolvedValue(patient_Caregiver);
    (
      ProgramEnrollement.findByPk as jest.MockedFunction<
        typeof ProgramEnrollement.findByPk
      >
    ).mockResolvedValue(program_Enrollement);
    (
      Patient.findByPk as jest.MockedFunction<typeof Patient.findByPk>
    ).mockResolvedValue(patient);
    (
      ProgramEnrollement.findAll as jest.MockedFunction<
        typeof ProgramEnrollement.findAll
      >
    ).mockResolvedValue(programs_Enrollements_patient);
  });

  it("should delete a caregiver successfully", async () => {
    await deleteCaregiver(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "success_caregiver_deleted",
    });
    expect(res.status).toHaveBeenCalledTimes(1); // Vérifier que status est appelé une seule fois
    expect(res.json).toHaveBeenCalledTimes(1); // Vérifier que json est appelé une seule fois
  });

  it("should return 404 if caregiver is not found", async () => {
    Caregiver.findByPk.mockResolvedValue(null); // Simuler que le soignant n'est pas trouvé

    await deleteCaregiver(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "error_caregiver_not_found",
    });
  });

  it("should return 404 if Patient-Caregiver relation is not found", async () => {
    Patient_Caregiver.findOne.mockResolvedValue(null); // Simuler aucune relation trouvée

    await deleteCaregiver(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "error_caregiver_relation_not_found",
    });
  });

  it("should return 404 if Program Enrollment is not found", async () => {
    ProgramEnrollement.findByPk.mockResolvedValue(null); // Simuler aucune inscription au programme trouvée

    await deleteCaregiver(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "error_program_enrollement_not_found",
    });
  });

  it("should return 404 if patient is not found", async () => {
    Patient.findByPk.mockResolvedValue(null); // Simuler que le patient n'est pas trouvé

    await deleteCaregiver(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "patient_not_found" });
  });

  it("should handle patient number of caregivers and programs correctly with number program change", async () => {
    const patient = {
      id: 3,
      numberOfCaregivers: 2,
      numberOfPrograms: 2,
      save: jest.fn(),
    };
    Patient.findByPk.mockResolvedValue(patient);
    await deleteCaregiver(req, res, next);

    expect(patient.numberOfCaregivers).toBe(1);
    expect(patient.numberOfPrograms).toBe(1);
    expect(patient.save).toHaveBeenCalledTimes(1);
  });

  it("should handle patient number of caregivers and programs correctly without any change in number program", async () => {
    const patient = {
      id: 3,
      numberOfCaregivers: 2,
      numberOfPrograms: 1,
      save: jest.fn(),
    };
    Patient.findByPk.mockResolvedValue(patient);
    const programs_Enrollements_patient = [
      { dataValues: { ProgramId: 5 } },
      { dataValues: { ProgramId: 5 } },
    ];
    (
      ProgramEnrollement.findAll as jest.MockedFunction<
        typeof ProgramEnrollement.findAll
      >
    ).mockResolvedValue(programs_Enrollements_patient);

    await deleteCaregiver(req, res, next);

    expect(patient.numberOfCaregivers).toBe(1);
    expect(patient.numberOfPrograms).toBe(1);
    expect(patient.save).toHaveBeenCalledTimes(1);
  });
});
=======
//
import { deleteCaregiver } from "../controller/CaregiverController";
import { Caregiver } from "../model/Caregiver";
import { Patient_Caregiver } from "../model/Patient_Caregiver";
import { ProgramEnrollement } from "../model/ProgramEnrollement";
import { Patient } from "../model/Patient";
import { sequelize } from "../util/database";
import { jest } from "@jest/globals";

// Mock des modèles et de la transaction Sequelize
jest.mock("../model/Caregiver");
jest.mock("../model/Patient_Caregiver");
jest.mock("../model/ProgramEnrollement");
jest.mock("../model/Patient");

(sequelize.transaction as jest.Mock) = jest.fn(() => ({
  commit: jest.fn(),
  rollback: jest.fn(),
}));

describe("deleteCaregiver", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = { params: { id: "1" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Mock des données
    const caregiver = { id: 1, destroy: jest.fn() };
    const patient_Caregiver = {
      CaregiverId: 1,
      ProgramEnrollementId: 2,
      destroy: jest.fn(),
    };
    const program_Enrollement = {
      id: 2,
      PatientId: 3,
      ProgramId: 5,
      destroy: jest.fn(),
    };
    const patient = {
      id: 3,
      numberOfCaregivers: 2,
      numberOfPrograms: 2,
      save: jest.fn(),
    };
    const programs_Enrollements_patient = [
      { dataValues: { ProgramId: 5 } },
      { dataValues: { ProgramId: 4 } },
    ];
    (
      Caregiver.findByPk as jest.MockedFunction<typeof Caregiver.findByPk>
    ).mockResolvedValue(caregiver);
    (
      Patient_Caregiver.findOne as jest.MockedFunction<
        typeof Patient_Caregiver.findOne
      >
    ).mockResolvedValue(patient_Caregiver);
    (
      ProgramEnrollement.findByPk as jest.MockedFunction<
        typeof ProgramEnrollement.findByPk
      >
    ).mockResolvedValue(program_Enrollement);
    (
      Patient.findByPk as jest.MockedFunction<typeof Patient.findByPk>
    ).mockResolvedValue(patient);
    (
      ProgramEnrollement.findAll as jest.MockedFunction<
        typeof ProgramEnrollement.findAll
      >
    ).mockResolvedValue(programs_Enrollements_patient);
  });

  it("should delete a caregiver successfully", async () => {
    await deleteCaregiver(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "success_caregiver_deleted",
    });
    expect(res.status).toHaveBeenCalledTimes(1); // Vérifier que status est appelé une seule fois
    expect(res.json).toHaveBeenCalledTimes(1); // Vérifier que json est appelé une seule fois
  });

  it("should return 404 if caregiver is not found", async () => {
    Caregiver.findByPk.mockResolvedValue(null); // Simuler que le soignant n'est pas trouvé

    await deleteCaregiver(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "error_caregiver_not_found",
    });
  });

  it("should return 404 if Patient-Caregiver relation is not found", async () => {
    Patient_Caregiver.findOne.mockResolvedValue(null); // Simuler aucune relation trouvée

    await deleteCaregiver(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "error_caregiver_relation_not_found",
    });
  });

  it("should return 404 if Program Enrollment is not found", async () => {
    ProgramEnrollement.findByPk.mockResolvedValue(null); // Simuler aucune inscription au programme trouvée

    await deleteCaregiver(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "error_program_enrollement_not_found",
    });
  });

  it("should return 404 if patient is not found", async () => {
    Patient.findByPk.mockResolvedValue(null); // Simuler que le patient n'est pas trouvé

    await deleteCaregiver(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "patient_not_found" });
  });

  it("should handle patient number of caregivers and programs correctly with number program change", async () => {
    const patient = {
      id: 3,
      numberOfCaregivers: 2,
      numberOfPrograms: 2,
      save: jest.fn(),
    };
    Patient.findByPk.mockResolvedValue(patient);
    await deleteCaregiver(req, res, next);

    expect(patient.numberOfCaregivers).toBe(1);
    expect(patient.numberOfPrograms).toBe(1);
    expect(patient.save).toHaveBeenCalledTimes(1);
  });

  it("should handle patient number of caregivers and programs correctly without any change in number program", async () => {
    const patient = {
      id: 3,
      numberOfCaregivers: 2,
      numberOfPrograms: 1,
      save: jest.fn(),
    };
    Patient.findByPk.mockResolvedValue(patient);
    const programs_Enrollements_patient = [
      { dataValues: { ProgramId: 5 } },
      { dataValues: { ProgramId: 5 } },
    ];
    (
      ProgramEnrollement.findAll as jest.MockedFunction<
        typeof ProgramEnrollement.findAll
      >
    ).mockResolvedValue(programs_Enrollements_patient);

    await deleteCaregiver(req, res, next);

    expect(patient.numberOfCaregivers).toBe(1);
    expect(patient.numberOfPrograms).toBe(1);
    expect(patient.save).toHaveBeenCalledTimes(1);
  });
});
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
