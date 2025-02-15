// objective: manage the routes of the sessionRecord entity
// // objective: gérer les routes de l'entité sessionRecord
import express from 'express';
import { createSessionRecord, getSessionRecords } from '../controllers/sessionRecordController';

const router = express.Router();

// Route pour créer une session
router.post('/session-record', createSessionRecord);

// Route pour récupérer toutes les sessions
router.get('/session-records', getSessionRecords);

export default router;
