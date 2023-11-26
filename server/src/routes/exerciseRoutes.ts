import { Router } from 'express';
import ExerciseController from '../controllers/exerciseController';

const router = Router();

router.get('/', ExerciseController.getAllExercises);
router.get('/:id', ExerciseController.getExerciseById);
// router.post('/', ExerciseController.createExercise);
// router.put('/:id', ExerciseController.updateExerciseById);
// router.delete('/:id', ExerciseController.deleteExerciseById);

export default router;
