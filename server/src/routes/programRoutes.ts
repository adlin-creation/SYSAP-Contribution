import express from 'express';
import programController from '../controllers/programController'; // Import your program controller module

const router = express.Router();

router.get('/', programController.getAllPrograms);
router.get('/:programName', programController.getProgramByName);

export default router;
