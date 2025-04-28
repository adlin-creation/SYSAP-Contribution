import express from "express";
import isAuth from "../util/isAuth";

const router = express.Router();

const programPhaseController = require("../controller/ProgramPhaseController");

router.post("/create-phase", isAuth, programPhaseController.createProgramPhase);

router.post("/add-cycle", isAuth, programPhaseController.addCycle);

router.get("/phase/:phaseKey", isAuth, programPhaseController.getProgramPhase);

router.get("/phases", isAuth, programPhaseController.getProgramPhases);

router.put(
  "/update-phase/:phaseKey",
  isAuth,
  programPhaseController.updateProgramPhase
);

router.delete(
  "/delete-phase/:phaseKey",
  isAuth,
  programPhaseController.deleteProgramPhase
);

export default router;
