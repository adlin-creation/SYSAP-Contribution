import express from 'express';
import PatientController from '../controllers/patientController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, PatientController.getAllPatients);
router.get('/:id', PatientController.getPatientById);

export default router;
