
import express from "express";
import isAuth from "../util/isAuth";

const router = express.Router();
const patientController = require("../controller/PatientController");

router.post("/create-patient", isAuth, patientController.createPatient);
router.put("/update-patient/:id", isAuth, patientController.updatePatient);
router.delete("/delete-patient/:id", isAuth, patientController.deletePatient);
router.get("/patient/:id", isAuth, patientController.getPatient);
router.get("/patients", isAuth, patientController.getPatients);

export default router;