import express from "express";
import isAuth from "../util/isAuth";
import upload from "../util/multerConfig";

const router = express.Router();

const programController = require("../controller/ProgramController");

router.post(
  "/create-program",
  isAuth,
  upload.single("image"),
  programController.createProgram
);

router.get("/program/:programKey", isAuth, programController.getProgram);

router.get("/programs", isAuth, programController.getPrograms);

router.get("/search", isAuth, programController.searchPrograms);

router.get(
  "/programs/:id/sessions",
  isAuth,
  programController.getSessionsByProgram
);

router.get("/:id", isAuth, programController.getProgramDetails);

router.post(
  "/:programKey/add-phase",
  isAuth,
  programController.addProgramPhase
);

router.get("/:programKey/phases", isAuth, programController.getProgramPhases);

router.put(
  "/update-program/:programKey",
  isAuth,
  upload.single("image"),
  programController.updateProgram
);

router.delete(
  "/delete-program/:programKey",
  isAuth,
  programController.deleteProgram
);

router.patch('/programs/:programKey/toggle', isAuth, programController.toggleProgramActivation);

export default router;
