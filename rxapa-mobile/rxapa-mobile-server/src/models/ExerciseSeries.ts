import { Exercise } from './Exercise';
import { Interval } from './Interval';

/**
 * Represents a series of exercises with their order and repetition intervals.
 */
export class ExerciseSeries {
    name: string; // Name of the exercise series
    description: string; // Description of the series
    exercices: Map<Exercise, Interval>; // Map of exercises and their intervals
    exerciseOrders: Map<number, Exercise>; // Map of exercise order to exercise

    /**
     * @param n - Name of the series
     * @param d - Description of the series
     */
    constructor(n: string, d: string) {
        this.name = n;
        this.description = d;
        this.exercices = new Map<Exercise, Interval>();
        this.exerciseOrders = new Map<number, Exercise>();
    }

    /**
     * Adds an exercise to the series.
     * @param ex - The exercise to add
     * @param interv - The interval of repetitions for the exercise
     * @param position - The order of the exercise in the series
     */
    addExercice(ex: Exercise, interv: Interval, position: number) {
        this.exercices.set(ex, interv);
        this.exerciseOrders.set(position, ex);
    }

    /**
     * Retrieves the exercise at a specific position in the series.
     * @param position - The position of the exercise
     * @returns The exercise at the given position
     */
    getExerciseAtPosition(position: number) {
        return this.exerciseOrders.get(position);
    }

    /**
     * Retrieves the total number of exercises in the series.
     * @returns The number of exercises
     */
    getNumberOfExercices() {
        return this.exercices.size;
    }
}
