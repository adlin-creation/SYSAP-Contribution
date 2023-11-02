import express from 'express';
import PatientController from '../controllers/patientController';

const router = express.Router();

router.get('/', PatientController.getAllPatients);
router.get('/:id', PatientController.getPatientById);
router.post('/', PatientController.createPatient);
router.put('/:id', PatientController.updatePatientById);
router.delete('/:id', PatientController.deletePatientById);

export default router;
