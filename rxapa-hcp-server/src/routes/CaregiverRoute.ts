
import express from "express";
import isAuth from "../util/isAuth";

const router = express.Router();
const caregiverController = require("../controller/CaregiverController");

router.post("/create-caregiver", isAuth, caregiverController.createCaregiver);
router.put("/update-caregiver/:id", isAuth, caregiverController.updateCaregiver);
router.delete("/delete-caregiver/:id", isAuth, caregiverController.deleteCaregiver);
router.get("/caregiver/:id", isAuth, caregiverController.getCaregiver);
router.get("/caregivers", isAuth, caregiverController.getCaregivers);
router.get("/caregiver/:id/patients", isAuth, caregiverController.getPatientsByCaregiver);

export default router;