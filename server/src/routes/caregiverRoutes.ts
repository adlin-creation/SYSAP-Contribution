import { Router } from "express";
import CaregiverController from '../controllers/caregiverController';

const router = Router();

router.get('/:caregiverId/patients', CaregiverController.getPatientsForCaregiver);

export default router;