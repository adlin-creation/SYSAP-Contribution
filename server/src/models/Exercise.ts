import { URL } from 'url';
import db from '../db/db-access';

export class Exercise {
    id?: number;
    name: string;
    description: string;
    numberRepetitionsMin: number;
    numberRepetitionsMax: number;
    url: URL | null;

    constructor(
        name: string,
        description: string,
        min: number,
        max: number,
        url: string | null) 
    {
        this.name = name;
        this.description = description;
        this.numberRepetitionsMin = min;
        this.numberRepetitionsMax = max;
        this.url = url ? new URL(url) : null;
    }

    // TODO: all CRUD methods in models are subject to change, here now for testing
    static createExercise(
        name: string,
        description: string,
        min: number,
        max: number,
        url: string | null,
        callback: (success: boolean) => void
    ) {
        const query = 'INSERT INTO Exercise (ExerciseName, ExerciseDescription, ExerciseNumberRepetitionsMin, ExerciseNumberRepetitionsMax, ExerciseDescriptionURL) VALUES (?, ?, ?, ?, ?)';
        db.run(
            query,
            [name, description, min, max, url],
            function (err) {
                if (err) {
                    console.error('Error creating exercise:', err.message);
                    callback(false);
                } else {
                    callback(true);
                }
            }
        );
    }

    static getAllExercises(callback: (exercises: Exercise[]) => void) {
        const query = 'SELECT * FROM Exercise';
        db.all(query, (err: Error, rows: any[]) => {
            if (err) {
                console.error('Error fetching exercises:', err.message);
                callback([]);
            } else {
                const exercises = rows.map((row) => Exercise.fromRow(row));
                callback(exercises);
            }
        });
    }

    static getExerciseById(id: number, callback: (exercise: Exercise | null) => void) {
        const query = 'SELECT * FROM Exercise WHERE idExercise = ?';
        db.get(query, [id], (err: Error, row: any) => {
            if (err) {
                console.error('Error fetching exercise:', err.message);
                callback(null);
            } else if (!row) {
                callback(null);
            } else {
                const exercise = Exercise.fromRow(row);
                callback(exercise);
            }
        });
    }

    static updateExerciseById(
        id: number,
        name: string,
        description: string,
        min: number,
        max: number,
        url: string | null,
        callback: (success: boolean) => void
    ) {
        const query =
            'UPDATE Exercise SET ExerciseName = ?, ExerciseDescription = ?, ' +
            'ExerciseNumberRepetitionsMin = ?, ExerciseNumberRepetitionsMax = ?, ExerciseDescriptionURL = ? ' +
            'WHERE idExercise = ?';
        db.run(
            query,
            [name, description, min, max, url, id],
            function (err) {
                if (err) {
                    console.error('Error updating exercise:', err.message);
                    callback(false);
                } else {
                    callback(this.changes > 0);
                }
            }
        );
    }

    static deleteExerciseById(id: number, callback: (success: boolean) => void) {
        const query = 'DELETE FROM Exercise WHERE idExercise = ?';
        db.run(query, [id], function (err) {
            if (err) {
                console.error('Error deleting exercise:', err.message);
                callback(false);
            } else {
                callback(this.changes > 0);
            }
        });
    }

    static fromRow(row: any): Exercise {
        return new Exercise(
            row.ExerciseName,
            row.ExerciseDescription,
            row.ExerciseNumberRepetitionsMin,
            row.ExerciseNumberRepetitionsMax,
            row.ExerciseDescriptionURL
        );
    }
}
