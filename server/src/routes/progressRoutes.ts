import { Router } from 'express';
import ProgramController from "../controllers/programController";
import progressController from "../controllers/progressController";

const router = Router();

router.get("/", progressController.testConnection);

export default router;