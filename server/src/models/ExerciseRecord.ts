import { Exercise } from './Exercise';

export class ExerciseRecord {
    exercise: Exercise;
    numberSeries: number;
    numberRepetitions: number;

    constructor(ex: Exercise, numSeries: number, numRepetitions: number) {
        this.exercise = ex;
        this.numberSeries = numSeries;
        this.numberRepetitions = numRepetitions;
    }
}
