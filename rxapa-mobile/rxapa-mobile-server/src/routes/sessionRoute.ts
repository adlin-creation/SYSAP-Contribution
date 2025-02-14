// objective: manage the routes of the session entity
// // objective: gérer les routes de l'entité session
import express from 'express';
import { SessionController } from '../controllers/sessionController';

const router = express.Router();

// Route pour récupérer les exercices par ProgramEnrollementId
router.get('/sessions/exercises-by-program', SessionController.getExercisesByProgramEnrollementId);

export default router;
