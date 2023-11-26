import { Patient } from './Patient';
import { Program } from './Program';
import { ProgramDayRecord } from './ProgramDayRecord';

export class ProgramEnrollment {
    patient: Patient;
    program: Program;
    enrollmentCode: string;
    enrollmentDate: Date;
    startDate: Date;
    dayRecords: Map<number, ProgramDayRecord>;

    constructor(p: Patient, prog: Program, code: string, enrDate: Date, startDate: Date) {
        this.patient = p;
        this.program = prog;
        this.enrollmentCode = code;
        this.enrollmentDate = enrDate;
        this.startDate = startDate;
        this.dayRecords = new Map<number, ProgramDayRecord>();
    }
}
