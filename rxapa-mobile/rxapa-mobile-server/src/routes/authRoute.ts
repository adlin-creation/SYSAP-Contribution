// objective: handle the routes of the authentication
// // objective: gérer les routes de l'authentification
import { Router } from 'express';
import { authenticate } from '../controllers/authController';

const router = Router();

router.post('/authenticate', authenticate);

export default router;
