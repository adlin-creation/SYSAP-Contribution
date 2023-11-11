import Exercise from './Exercise';
import ExerciseRecord from './ExerciseRecord';
import ExerciseSeries from './ExerciseSeries';
import ExerciseSeriesExercise from './ExerciseSeriesExercise';
import Program from './Program';
import ProgramDayRecord from './ProgramDayRecord';
import User from './User';
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
      
    Program.hasMany(User, {
        foreignKey: 'ProgramName',
        as: 'Users',
    });
    User.belongsTo(Program, {
        foreignKey: 'ProgramName',
        as: 'Program',
    });

    User.hasMany(Reminder, {
        foreignKey: 'UserId',
        as: 'Reminders',
    });
    Reminder.belongsTo(User, {
        foreignKey: 'UserId',
        as: 'User',
    });
    
    User.hasMany(ProgramDayRecord, {
        foreignKey: 'UserId',
        as: 'DayRecords',
    });
    ProgramDayRecord.belongsTo(User, {
        foreignKey: 'UserId',
        as: 'User',
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