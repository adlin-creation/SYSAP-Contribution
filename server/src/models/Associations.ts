import Exercise from './Exercise';
import ExerciseRecord from './ExerciseRecord';
import ExerciseSeries from './ExerciseSeries';
import ExerciseSeriesExercise from './ExerciseSeriesExercise';
import Program from './Program';
import ProgramDayRecord from './ProgramDayRecord';
import Patient from './Patient';
import ProgramExerciseSeries from './ProgramExerciseSeries';
import Reminder from './Reminder';
import ProgressionExercices from "./ProgressionExerices";
import ProgressionMarches from "./ProgressionMarches";
import ProgressionExerices from "./ProgressionExerices";

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
      
    Program.hasMany(Patient, {
        foreignKey: 'ProgramName',
        as: 'Patients',
    });
    Patient.belongsTo(Program, {
        foreignKey: 'ProgramName',
        as: 'Program',
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

    Patient.hasMany(ProgressionMarches, {
        foreignKey: 'PatientId',
        as: 'ProgressionMarches',
    });
    ProgressionMarches.belongsTo(Patient, {
        foreignKey: 'PatientId',
        as: 'PatientId',
    })

    Patient.hasMany(ProgressionExercices, {
        foreignKey: 'PatientId',
        as: 'ProgressionExercices',
    });
    ProgressionExercices.belongsTo(Patient, {
        foreignKey: 'PatientId',
        as: 'PatientId',
    })
}