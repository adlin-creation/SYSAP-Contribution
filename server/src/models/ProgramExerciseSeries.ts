import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/database';

class ProgramExerciseSeries extends Model {
    public idProgramExerciseSeries!: number;
    public ProgramId!: number;
    public ExerciseSeriesId!: number;
    public StartDay!: number;
    public EndDay!: number;
}

ProgramExerciseSeries.init(
    {
        idProgramExerciseSeries: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: false,
        },
        ProgramId: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        ExerciseSeriesId: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        StartDay: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        EndDay: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'ProgramExerciseSeries',
        tableName: 'ProgramExerciseSeries',
        timestamps: false,
    }
);

export default ProgramExerciseSeries;