import { Interval } from '../models/Interval';

/**
 * Represents a single exercise.
 */
export class Exercise {
    name: string; // Name of the exercise
    description: string; // Description of the exercise
    numberRepetitions: Interval; // Range of repetitions
    url: URL; // URL to a video or image illustrating the exercise

    /**
     * @param n - Name of the exercise
     * @param d - Description of the exercise
     * @param nR - Number of repetitions as an interval
     * @param ur - URL of the exercise media (image or video)
     */
    constructor(n: string, d: string, nR: Interval, ur: URL) {
        this.name = n;
        this.description = d;
        this.numberRepetitions = nR;
        this.url = ur;
    }
}
