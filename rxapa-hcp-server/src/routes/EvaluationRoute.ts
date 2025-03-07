import express from "express";
const router = express.Router();

const evaluationController = require("../controller/EvaluationController");

// Routes pour les évaluations PACE
router.post(
  "/create-pace-evaluation",
  evaluationController.createPaceEvaluation
);
router.put("/evaluation-pace/:id", evaluationController.updatePaceEvaluation);
router.get("/evaluation-pace/:id", evaluationController.getPaceEvaluation);
router.get("/evaluations-pace", evaluationController.getPaceEvaluations);
router.delete(
  "/evaluation-pace/:id",
  evaluationController.deletePaceEvaluation
);
// Routes pour les evaluations PATH
router.post(
  "/create-path-evaluation",
  evaluationController.createPathEvaluation
);
router.put("/evaluation-path/:id", evaluationController.updatePathEvaluation);
router.get("/evaluation-path/:id", evaluationController.getPathEvaluation);
router.get("/evaluations-path", evaluationController.getPathEvaluations);
router.delete(
  "/evaluation-path/:id",
  evaluationController.deletePathEvaluation
);

router.get("/patients/search", evaluationController.searchPatients);

export default router;
