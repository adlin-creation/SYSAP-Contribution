import express from "express";
const router = express.Router();

const evaluationController = require("../controller/EvaluationController");

// Routes pour les évaluations PACE
router.post("/evaluation", evaluationController.createEvaluation);
router.put("/evaluation/:id", evaluationController.updateEvaluation);
router.get("/evaluation/:id", evaluationController.getEvaluation);
router.get("/evaluations", evaluationController.getEvaluations);
router.delete("/evaluation/:id", evaluationController.deleteEvaluation);
router.get("/patients/search", evaluationController.searchPatients);

export default router;
