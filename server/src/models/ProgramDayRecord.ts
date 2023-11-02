import { ExerciseSeries } from './ExerciseSeries';
import { ExerciseRecord } from './ExerciseRecord';
import { Exercise } from './Exercise';
import { DifficultyLevel, SelfEfficacy, PainLevel, SatisfactionLevel, MotivationLevel } from './Enums';

export class ProgramDayRecord {
    day: Date;
    exerciseSeries: ExerciseSeries;
    exerciseRecords: Map<Exercise, ExerciseRecord>;
    difficultyLevel: DifficultyLevel;
    selfEfficacy: SelfEfficacy;
    painLevel: PainLevel;
    satisfactionLevel: SatisfactionLevel;
    motivationLevel: MotivationLevel;

    constructor(d: Date, exSeries: ExerciseSeries) {
        this.day = d;
        this.exerciseSeries = exSeries;
        this.exerciseRecords = new Map<Exercise, ExerciseRecord>();
        this.difficultyLevel = DifficultyLevel.Easy;
        this.selfEfficacy = SelfEfficacy.NotConfident;
        this.painLevel = PainLevel.NoPain;
        this.satisfactionLevel = SatisfactionLevel.Satisfied;
        this.motivationLevel = MotivationLevel.Motivated;
    }
}
