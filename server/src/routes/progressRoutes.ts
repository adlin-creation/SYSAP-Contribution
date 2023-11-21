import { Router } from 'express';
import progressController from "../controllers/progressController";

const router = Router();

router.get("/", progressController.testConnection);
router.post("/updateMarche", progressController.updateProgressionMarche);
router.post("/addExercice", progressController.addProgressionExercises);
router.post("/updateExercice", progressController.updateProgressionExercices);

router.get("/progressionMarche/:idPatient", progressController.getProgressionMarche)
router.get("/progressionExercices/:idPatient", progressController.getProgressionExercice)
router.get("/getAllMarche", progressController.getAllMarche);
router.get("/getAllExercices", progressController.getAllExercices);

router.delete("/deleteAllMarche", progressController.deleteAllMarche);
export default router;