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
// Routes pour les evaluations match
router.post(
  "/create-match-evaluation",
  evaluationController.createMatchEvaluation
);
router.put("/evaluation-match/:id", evaluationController.updateMatchEvaluation);
router.get("/evaluation-match/:id", evaluationController.getMatchEvaluation);
router.get("/evaluations-match", evaluationController.getMatchEvaluations);
router.delete(
  "/evaluation-match/:id",
  evaluationController.deleteMatchEvaluation
);

router.get("/patients/search", evaluationController.searchPatients);

export default router;
