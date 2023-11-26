import { Request, Response } from 'express';
import Exercise from '../models/Exercise'; // Import the Exercise model

class ExerciseController {
    // Get all exercises
    static getAllExercises(req: Request, res: Response): void {
        Exercise.findAll()
        .then((exercises) => {
            res.json(exercises);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        });
    }

    // static createExercise(req: Request, res: Response): void {
    //     const { 
    //         ExerciseName, 
    //         ExerciseDescription, 
    //         ExerciseNumberRepetitionsMin, 
    //         ExerciseNumberRepetitionsMax, 
    //         ExerciseDescriptionURL } = req.body;
    
    //     Exercise.create({
    //       ExerciseName,
    //       ExerciseDescription,
    //       ExerciseNumberRepetitionsMin,
    //       ExerciseNumberRepetitionsMax,
    //       ExerciseDescriptionURL,
    //     })
    //       .then((exercise) => {
    //         res.status(201).json(exercise);
    //       })
    //       .catch((error) => {
    //         console.error(error);
    //         res.status(500).json({ error: 'Internal server error' });
    //       });
    //   }

    static getExerciseById(req: Request, res: Response): void {
        const { id } = req.params;

        Exercise.findByPk(id)
        .then((exercise) => {
            if (!exercise) {
            res.status(404).json({ error: 'Exercise not found' });
            } else {
            res.json(exercise);
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        });
    }
    // static updateExerciseById(req: Request, res: Response): void {
    //     const { id } = req.params;
    //     const {
    //     ExerciseName,
    //     ExerciseDescription,
    //     ExerciseNumberRepetitionsMin,
    //     ExerciseNumberRepetitionsMax,
    //     ExerciseDescriptionURL,
    //     } = req.body;

    //     Exercise.findByPk(id)
    //     .then((exercise) => {
    //         if (!exercise) {
    //             res.status(404).json({ error: 'Exercise not found' });
    //         } else {
    //             exercise.ExerciseName = ExerciseName;
    //             exercise.ExerciseDescription = ExerciseDescription;
    //             exercise.ExerciseNumberRepetitionsMin = ExerciseNumberRepetitionsMin;
    //             exercise.ExerciseNumberRepetitionsMax = ExerciseNumberRepetitionsMax;
    //             exercise.ExerciseDescriptionURL = ExerciseDescriptionURL;

    //             exercise.save()
    //                 .then((updatedExercise) => {
    //                 res.json(updatedExercise);
    //                 })
    //                 .catch((error) => {
    //                 console.error(error);
    //                 res.status(500).json({ error: 'Internal server error' });
    //             });
    //         }
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     });
    // }

    // static deleteExerciseById(req: Request, res: Response): void {
    //     const { id } = req.params;

    //     Exercise.findByPk(id)
    //     .then((exercise) => {
    //         if (!exercise) {
    //         res.status(404).json({ error: 'Exercise not found' });
    //         } else {
    //         exercise.destroy()
    //             .then(() => {
    //                 res.status(204).send();
    //             })
    //             .catch((error) => {
    //                 console.error(error);
    //                 res.status(500).json({ error: 'Internal server error' });
    //             });
    //         }
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     });
    // }
}

export default ExerciseController;
