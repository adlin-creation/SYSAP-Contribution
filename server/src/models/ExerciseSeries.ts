import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/database';

class ExerciseSeries extends Model {
    public idExerciseSeries!: number;
    public ExerciseSeriesName!: string;
    public ExerciseSeriesDescription!: string | null;
}

ExerciseSeries.init(
    {
        idExerciseSeries: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: false,
        },
        ExerciseSeriesName: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        ExerciseSeriesDescription: {
        type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'ExerciseSeries',
        tableName: 'ExerciseSeries',
        timestamps: false,
    }
);

export default ExerciseSeries;