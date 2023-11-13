import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/database';

class ExerciseSeriesExercise extends Model {
    public idExerciseSeriesExercise!: number;
    public ExerciseSeriesId!: number;
    public ExerciseId!: number;
    public ExerciseOrder!: number;
    public ExerciseNumberSeriesMin!: number;
    public ExerciseNumberSeriesMax!: number;
}

ExerciseSeriesExercise.init(
    {
        idExerciseSeriesExercise: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: false,
        },
        ExerciseSeriesId: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        ExerciseId: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        ExerciseOrder: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ExerciseNumberSeriesMin: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ExerciseNumberSeriesMax: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'ExerciseSeriesExercise',
        tableName: 'ExerciseSeriesExercise',
        timestamps: false,
    }
);

export default ExerciseSeriesExercise;