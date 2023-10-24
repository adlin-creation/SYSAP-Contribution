import { Request, Response } from 'express';
import { Exercise } from '../models/Exercise';

// TODO: controllers with CRUD operations are subject to change, here now for testing
export default class ExerciseController {
    static getAllExercises(req: Request, res: Response): void {
        Exercise.getAllExercises((exercises) => {
            res.json(exercises);
        });
    }

    static getExerciseById(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        Exercise.getExerciseById(id, (exercise) => {
            if (exercise) {
                res.json(exercise);
            } else {
                res.status(404).json({ error: 'Exercise not found' });
            }
        });
    }

    static createExercise(req: Request, res: Response): void {
        const { name, description, min, max, url } = req.body;
        Exercise.createExercise(name, description, min, max, url, (success) => {
            if (success) {
                res.status(201).json({ message: 'Exercise created' });
            } else {
                res.status(500).json({ error: 'Failed to create exercise' });
            }
        });
    }

    static updateExerciseById(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        const { name, description, min, max, url } = req.body;
        Exercise.updateExerciseById(id, name, description, min, max, url, (success) => {
            if (success) {
                res.json({ message: 'Exercise updated' });
            } else {
                res.status(404).json({ error: 'Exercise not found' });
            }
        });
    }

    static deleteExerciseById(req: Request, res: Response): void {
        const id = parseInt(req.params.id);
        Exercise.deleteExerciseById(id, (success) => {
            if (success) {
                res.json({ message: 'Exercise deleted' });
            } else {
                res.status(404).json({ error: 'Exercise not found' });
            }
        });
    }
}
