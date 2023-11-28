import { Router } from 'express';
import progressController from "../controllers/progressController";

const router = Router();

router.get("/", progressController.testConnection);
router.post("/updateMarche", progressController.updateProgressionMarche);
router.post("/updateExercice", progressController.updateProgressionExercices);

// Faire un get pour aller chercher tou
router.get("/progressionMarche/:idPatient/:week?", progressController.getProgressionMarche)
router.get("/progressionExercices/:idPatient/:week?", progressController.getProgressionExercice)
router.get("/getAllMarche", progressController.getAllMarche);
router.get("/getAllExercices", progressController.getAllExercices);

router.delete("/deleteAllMarche", progressController.deleteAllMarche);
router.delete("/deleteAllExercices", progressController.deleteAllExercices);
export default router;