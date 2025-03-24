import express from "express";
import multer from "multer"; // ✅ ajout

import isAuth from "../util/isAuth";

const router = express.Router();
const upload = multer({ dest: "images/" }); // ✅ config upload


const exerciseController = require("../controller/ExerciseController");

router.post("/create-exercise", isAuth, upload.single("file"), exerciseController.createExercise); // ✅ modifié

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
