import express from "express";
import isAuth from "../util/isAuth";

const router = express.Router();
const professionalUserController = require("../controller/ProfessionalUserController");

router.post("/create-professional-user", isAuth, professionalUserController.createProfessionalUser);
router.put("/update-professional-user/:id", isAuth, professionalUserController.updateProfessionalUser);
router.delete("/delete-professional-user/:id", isAuth, professionalUserController.deleteProfessionalUser);
router.get("/professional-user/:id", isAuth, professionalUserController.getProfessionalUser);
router.get("/professional-users", isAuth, professionalUserController.getProfessionalUsers);
router.get("/kinesiologist-patients/:id", isAuth, professionalUserController.getKinesiologistPatients);
router.get("/doctor-patients/:id", isAuth, professionalUserController.getDoctorPatients);
router.get("/generate-password", isAuth, professionalUserController.generatePassword);

export default router;
