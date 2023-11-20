import { Router } from 'express';
import progressController from "../controllers/progressController";

const router = Router();

router.get("/", progressController.testConnection);
router.post("/addMarche", progressController.addProgressionMarche);
router.post("/updateMarche", progressController.addProgressionExercises);
router.post("/addExercice", progressController.updateProgressionMarche);
router.post("/updateExercice", progressController.updateProgressionExercices);

router.get("/progressionMarche/:idPatient", progressController.getProgressionMarche)
router.get("/progressionExercices/:idPatient", progressController.getProgressionExercice)
router.get("/getAllMarche", progressController.getAllMarche);
router.get("/getAllExercices", progressController.getAllExercices);
export default router;