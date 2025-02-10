import express from "express";
import isAuth from "../util/isAuth";

const router = express.Router();

const exerciseController = require("../controller/ExerciseController");

router.post("/create-exercise", isAuth, exerciseController.createExercise);

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

export default router;
