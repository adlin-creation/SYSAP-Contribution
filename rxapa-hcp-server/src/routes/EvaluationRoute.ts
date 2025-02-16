import express from "express"

const router = express.Router();

const evaluationController = require("../controller/EvaluationController");

router.get("/evaluation", evaluationController.evaluation);
router.post("/evaluation", evaluationController.evaluation);
