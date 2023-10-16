import { ExerciseSeries } from './ExerciseSeries';
import { Interval } from './Interval';

export class Program {
    name: String;
    description: String;
    duration: number;
    mapExerciseSeries: Map<Interval, ExerciseSeries>;

    constructor(n: String, des: string, d: number) {
        this.name = n;
        this.description = des;
        this.duration = d;
        this.mapExerciseSeries = new Map<Interval, ExerciseSeries>();
    }
}
