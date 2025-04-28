// objective: to define the routes for patient statistics
// // objective: définir les routes pour les statistiques des patients
import express from 'express';
import { PatientStatisticsController } from '../controllers/patientStatisticsController';

const router = express.Router();

// Route to fetch patient statistics
router.get('/patient-statistics/details', PatientStatisticsController.getPatientStatistics);

export default router;
