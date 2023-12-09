import { Router } from 'express';
import ImpressionController from '../controllers/impressionController';
import ProgramController from '../controllers/programController';

const router = Router();

router.get("/", ImpressionController.testConnection);
router.get("/programme", ProgramController.getProgramByName);
router.get("/getAllMarche/:id", ImpressionController.getProgram);

export default router;

