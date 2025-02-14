/*import { Patient } from './Patient';
import { Program } from '../models/Program';
import { ProgramDayRecord } from '../models/ProgramDayRecord';

//
//Represents the enrollment of a patient in a fitness program.
//
export class ProgramEnrollment {
    patient: Patient; // The patient enrolled
    program: Program; // The program the patient is enrolled in
    enrollmentCode: string; // Unique enrollment code
    enrollmentDate: Date; // Date of enrollment
    startDate: Date; // Start date of the program
    dayRecords: Map<number, ProgramDayRecord>; // Day records indexed by date

    
     //@param p - The patient
     // @param prog - The program
     // @param code - The enrollment code
     // @param enrDate - The date of enrollment
     // @param startDate - The start date of the program
     
    constructor(p: Patient, prog: Program, code: string, enrDate: Date, startDate: Date) {
        this.patient = p;
        this.program = prog;
        this.enrollmentCode = code;
        this.enrollmentDate = enrDate;
        this.startDate = startDate;
        this.dayRecords = new Map<number, ProgramDayRecord>();
    }

    
     //Initializes a record for a specific day of the program.
     //@param fullDateObject - The date for which the record is created
     // @returns The initialized program day record
     
    initializeDayRecordForDay(fullDateObject: Date) {
        const day = this.stripDateToYearMonthDate(fullDateObject);
        const exerciseSeries = this.program.getExerciseSeriesForDay(this.getDayOfTheProgramCorrespondingToDate(day));
        if (!exerciseSeries) return null;

        const progDayRecord = new ProgramDayRecord(day, exerciseSeries);
        this.dayRecords.set(day.getTime(), progDayRecord);
        return progDayRecord;
    }

   
     //Strips the hour, minute, and second components from a date.
     //@param date - The date to strip
     // @returns The stripped date
     
    private stripDateToYearMonthDate(date: Date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return new Date(year, month, day);
    }

   
     //* Determines which day of the program corresponds to a given date.
    // * @param day - The date to check
     //* @returns The day of the program
     
    private getDayOfTheProgramCorrespondingToDate(day: Date) {
        return Math.floor((day.getTime() - this.startDate.getTime()) / (1000 * 3600 * 24)) + 1;
    }
}*/
