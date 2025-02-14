import { ExerciseSeries } from './ExerciseSeries';
import { Interval } from './Interval';

/**
 * Represents a fitness program consisting of multiple exercise series.
 */
export class Program {
    name: string; // Name of the program
    description: string; // Description of the program
    duration: number; // Duration of the program in days
    mapExerciseSeries: Map<Interval, ExerciseSeries>; // Map of intervals to exercise series

    /**
     * @param n - Name of the program
     * @param des - Description of the program
     * @param d - Duration of the program in days
     */
    constructor(n: string, des: string, d: number) {
        this.name = n;
        this.description = des;
        this.duration = d;
        this.mapExerciseSeries = new Map<Interval, ExerciseSeries>();
    }

    /**
     * Adds an exercise series to the program.
     * @param itr - The interval during which the series applies
     * @param exSeries - The exercise series to add
     */
    addExerciseSeries(itr: Interval, exSeries: ExerciseSeries) {
        this.mapExerciseSeries.set(itr, exSeries);
    }

    /**
     * Retrieves the exercise series for a specific day.
     * @param day - The day of the program
     * @returns The exercise series for the given day
     */
    getExerciseSeriesForDay(day: number) {
        if (day < 1 || day > this.duration) return null;

        for (const [interval, series] of this.mapExerciseSeries) {
            if (day >= interval.min && day <= interval.max) return series;
        }
        return null;
    }
}
