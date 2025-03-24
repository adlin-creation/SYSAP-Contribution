import express from "express";
import isAuth from "../util/isAuth";

const router = express.Router();
const patientController = require("../controller/PatientController");

router.post("/create-patient", isAuth, patientController.createPatient);
router.put("/update-patient/:id", isAuth, patientController.updatePatient);
router.delete("/delete-patient/:id", isAuth, patientController.deletePatient);
router.get("/patient/:id", isAuth, patientController.getPatient);
router.get("/patientDetails/:id", isAuth, patientController.getPatientDetails);
router.get("/patients", isAuth, patientController.getPatients);
router.get(
  "/patient/:id/sessions",
  isAuth,
  patientController.getPatientSessions
);
router.put(
  "/update-patient-with-caregivers/:id",
  isAuth,
  patientController.updatePatientWithCaregivers
);

export default router;
