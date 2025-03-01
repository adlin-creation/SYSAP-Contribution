import express from "express";
import isAuth from "../util/isAuth";

const router = express.Router();

const programController = require("../controller/ProgramController");

router.post("/create-program", isAuth, programController.createProgram);

router.get("/program/:programKey", isAuth, programController.getProgram);

router.get("/programs", isAuth, programController.getPrograms);

router.post(
  "/:programKey/add-phase",
  isAuth,
  programController.addProgramPhase
);

router.get("/:programKey/phases", isAuth, programController.getProgramPhases);

router.put(
  "/update-program/:programKey",
  isAuth,
  programController.updateProgram
);

router.delete(
  "/delete-program/:programKey",
  isAuth,
  programController.deleteProgram
);

export default router;
