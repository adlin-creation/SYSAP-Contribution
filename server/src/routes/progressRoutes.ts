import { Router } from 'express';
import progressController from "../controllers/progressController";

const router = Router();

router.get("/", progressController.testConnection);
router.post("/updateMarche", progressController.updateProgressionMarche);
router.post("/addExercice", progressController.addProgressionExercises);
router.post("/updateExercice", progressController.updateProgressionExercices);

// Faire un get pour aller chercher tou
router.get("/progressionMarche/:idPatient/:week?", progressController.getProgressionMarche)
router.get("/progressionExercices/:idPatient", progressController.getProgressionExercice)
router.get("/getAllMarche", progressController.getAllMarche);
router.get("/getAllExercices", progressController.getAllExercices);

router.delete("/deleteAllMarche", progressController.deleteAllMarche);
export default router;