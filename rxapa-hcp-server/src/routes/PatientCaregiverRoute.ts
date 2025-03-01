
import express from "express";
import isAuth from "../util/isAuth";

const router = express.Router();
const patientCaregiverController = require("../controller/PatientCaregiverController");

router.post("/create-patient-caregiver", isAuth, patientCaregiverController.createPatientCaregiver);
router.put("/update-patient-caregiver/:id", isAuth, patientCaregiverController.updatePatientCaregiver);
router.delete("/delete-patient-caregiver/:id", isAuth, patientCaregiverController.deletePatientCaregiver);
router.get("/patient-caregiver/:id", isAuth, patientCaregiverController.getPatientCaregiver);
router.get("/patient-caregivers", isAuth, patientCaregiverController.getPatientCaregivers);

export default router;