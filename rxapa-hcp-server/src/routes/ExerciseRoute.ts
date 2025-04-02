import express from "express";
import isAuth from "../util/isAuth";
import upload from "../util/multerConfig";
import { createExercise } from '../controller/ExerciseController';

const router = express.Router();

const exerciseController = require("../controller/ExerciseController");

router.post('/create-exercise',isAuth, upload.single("file"), createExercise);
router.post("/add/version", isAuth, exerciseController.addExerciseVersion);

router.post(
  "/create/version",
  isAuth,
  exerciseController.createExerciseVersion
);

router.get("/exercise/:exerciseKey", isAuth, exerciseController.getExercise);

router.get("/exercises", isAuth, exerciseController.getExercises);


router.delete(
  "/delete-exercise/:exerciseKey",
  isAuth,
  exerciseController.deleteExercise
);

router.put(
  "/update-exercise/:exerciseKey",
  isAuth,
  exerciseController.updateExercise
);


router.get("/images/:imageName", exerciseController.getImage);

router.get("/exercices/:patientId", isAuth, exerciseController.getExercisesByPatientId);

export default router;