import Exercise from './Exercise';
import ExerciseRecord from './ExerciseRecord';
import ExerciseSeries from './ExerciseSeries';
import ExerciseSeriesExercise from './ExerciseSeriesExercise';
import Program from './Program';
import ProgramDayRecord from './ProgramDayRecord';
import Patient from './Patient';
import ProgramEnrollment from './ProgramEnrollment';
import ProgramExerciseSeries from './ProgramExerciseSeries';
import Reminder from './Reminder';

export function createAssociations(){
    Program.hasMany(ProgramExerciseSeries, {
        foreignKey: 'ProgramName',
        as: 'ExerciseSeries',
    });
    ProgramExerciseSeries.belongsTo(Program, {
        foreignKey: 'ProgramName',
        as: 'Program',
    });
      

    ExerciseSeries.hasMany(ExerciseSeriesExercise, {
        foreignKey: 'ExerciseSeriesId',
        as: 'Exercises',
    });
    ExerciseSeriesExercise.belongsTo(ExerciseSeries, {
        foreignKey: 'ExerciseSeriesId',
        as: 'ExerciseSeries',
    });
      

    ProgramExerciseSeries.belongsTo(ExerciseSeries, {
        foreignKey: 'ExerciseSeriesId',
        as: 'Series',
    });
    ExerciseSeries.hasMany(ProgramExerciseSeries, {
        foreignKey: 'ExerciseSeriesId',
        as: 'Programs',
    });
      
    ExerciseSeriesExercise.belongsTo(Exercise, {
        foreignKey: 'ExerciseId',
        as: 'Exercise',
    });
    Exercise.hasMany(ExerciseSeriesExercise, {
        foreignKey: 'ExerciseId',
        as: 'SeriesExercises',
    });
      
    Program.hasMany(ProgramEnrollment, {
        foreignKey: 'ProgramName',
        as: 'ProgramEnrollments',
    });
    ProgramEnrollment.belongsTo(Program, {
        foreignKey: 'ProgramName',
        as: 'Program',
    });

    Patient.hasOne(ProgramEnrollment, {
        foreignKey: 'PatientId',
        as: 'ProgramEnrollment',
    });
    ProgramEnrollment.belongsTo(Patient, {
        foreignKey: 'PatientId',
        as: 'Patient',
    });

    Patient.hasMany(Reminder, {
        foreignKey: 'PatientId',
        as: 'Reminders',
    });
    Reminder.belongsTo(Patient, {
        foreignKey: 'PatientId',
        as: 'Patient',
    });
    
    Patient.hasMany(ProgramDayRecord, {
        foreignKey: 'PatientId',
        as: 'DayRecords',
    });
    ProgramDayRecord.belongsTo(Patient, {
        foreignKey: 'PatientId',
        as: 'Patient',
    });
      
    ProgramDayRecord.hasMany(ExerciseRecord, {
        foreignKey: 'ProgramDayRecordId',
        as: 'ExerciseRecords',
    });
    ExerciseRecord.belongsTo(ProgramDayRecord, {
        foreignKey: 'ProgramDayRecordId',
        as: 'ProgramDayRecord',
    });

    Exercise.hasMany(ExerciseRecord, {
        foreignKey: 'ExerciseId',
        as: 'ExerciseRecords',
    });
    ExerciseRecord.belongsTo(Exercise, {
        foreignKey: 'ExerciseId',
        as: 'Exercise',
    });
}