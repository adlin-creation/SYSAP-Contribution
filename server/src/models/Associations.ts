import Exercise from './Exercise';
import ExerciseRecord from './ExerciseRecord';
import ExerciseSeries from './ExerciseSeries';
import ExerciseSeriesExercise from './ExerciseSeriesExercise';
import Program from './Program';
import ProgramDayRecord from './ProgramDayRecord';
import User from './User';
import ProgramExerciseSeries from './ProgramExerciseSeries';

export function createAssociations(){
    Program.hasMany(ProgramExerciseSeries, {
        foreignKey: 'ProgramId',
        as: 'ExerciseSeries',
    });
    ProgramExerciseSeries.belongsTo(Program, {
        foreignKey: 'ProgramId',
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
      
    User.belongsTo(Program, {
        foreignKey: 'ProgramId',
        as: 'Program',
    });
    Program.hasMany(User, {
        foreignKey: 'ProgramId',
        as: 'Users',
    });

    User.hasMany(ProgramDayRecord, {
        foreignKey: 'UserId',
        as: 'DayRecords',
    });
    ProgramDayRecord.belongsTo(User, {
        foreignKey: 'UserId',
        as: 'User',
    });

    Program.hasMany(ProgramDayRecord, {
        foreignKey: 'ProgramId',
        as: 'DayRecords',
    });
    ProgramDayRecord.belongsTo(Program, {
        foreignKey: 'ProgramId',
        as: 'Program',
    });
      
    ProgramDayRecord.hasMany(ExerciseRecord, {
        foreignKey: 'ProgramDayRecordId',
        as: 'ExerciseRecords',
    });
    ExerciseRecord.belongsTo(ProgramDayRecord, {
        foreignKey: 'ProgramDayRecordId',
        as: 'ProgramDayRecord',
    });
}