export class SessionRecord {
    id?: number;
    key?: string;
    difficultyLevel: string;
    painLevel: string;
    satisfactionLevel: string;
    walkingTime: number;
    accomplishedExercises?: string;
    date?: Date;
    programEnrollmentId: number;
    sessionId?: number;

    constructor(data: Partial<SessionRecord>) {
        this.id = data.id;
        this.key = data.key;
        this.difficultyLevel = data.difficultyLevel!;
        this.painLevel = data.painLevel!;
        this.satisfactionLevel = data.satisfactionLevel!;
        this.walkingTime = data.walkingTime!;
        this.accomplishedExercises = data.accomplishedExercises;
        this.date = data.date || new Date();
        this.programEnrollmentId = data.programEnrollmentId!;
        this.sessionId = data.sessionId;
    }
}
