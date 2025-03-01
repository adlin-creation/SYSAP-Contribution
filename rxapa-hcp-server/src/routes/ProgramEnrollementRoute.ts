import express from "express";
import isAuth from "../util/isAuth";

const router = express.Router();
const programEnrollementController = require("../controller/ProgramEnrollementController");

router.post("/create-program-enrollement", isAuth, programEnrollementController.createProgramEnrollement);
router.post("/create-patient-with-caregivers", isAuth, programEnrollementController.createPatientWithCaregivers);
// router.post("/create-complete-enrollment",  isAuth, programEnrollementController.createCompleteEnrollment);
// router.post("/create-program-enrollement-with-caregivers", isAuth, programEnrollementController.createProgramEnrollementWithCaregivers);
router.put("/update-program-enrollement/:id", isAuth, programEnrollementController.updateProgramEnrollement);
router.delete("/delete-program-enrollement/:id", isAuth, programEnrollementController.deleteProgramEnrollement);
router.get("/program-enrollement/:id", isAuth, programEnrollementController.getProgramEnrollement);
router.get("/program-enrollements", isAuth, programEnrollementController.getProgramEnrollements);

export default router;