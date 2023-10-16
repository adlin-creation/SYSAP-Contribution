import { Exercise } from './Exercise';
import { Interval } from './Interval';
export class ExerciseSeries {
    name: string;
    description: string;
    exercises: Map<Exercise, Interval>;
    exerciseOrders: Map<number, Exercise>;

    constructor(n: string, d: string) {
        this.name = n;
        this.description = d;
        this.exercises = new Map<Exercise, Interval>();
        this.exerciseOrders = new Map<number, Exercise>();
    }
}
