import express from "express";
import isAuth from "../util/isAuth";
const router = express.Router();

const blocController = require("../controller/BlocController");

router.post("/create-bloc", isAuth, blocController.createBloc);

router.post("/:blocKey/add-exercise", isAuth, blocController.addExercise);

router.get("/bloc/:blocKey", isAuth, blocController.getBloc);

router.get("/blocs", isAuth, blocController.getBlocs);

router.get("/blocs/:patientId", isAuth, blocController.getBlocsByPatientId);

router.put("/update-bloc/:blocKey", isAuth, blocController.updateBloc);

router.delete("/delete-bloc/:blocKey", isAuth, blocController.deleteBloc);

router.delete('/remove-exercise-from-bloc', blocController.removeExerciseFromBloc);

export default router;
