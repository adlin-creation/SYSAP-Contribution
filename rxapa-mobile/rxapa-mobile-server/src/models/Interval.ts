/**
 * Represents a numerical range with minimum and maximum values.
 */
export class Interval {
    min: number; // Minimum value of the interval
    max: number; // Maximum value of the interval

    /**
     * @param mi - Minimum value
     * @param ma - Maximum value
     */
    constructor(mi: number, ma: number) {
        this.min = mi;
        this.max = ma;
    }
}
