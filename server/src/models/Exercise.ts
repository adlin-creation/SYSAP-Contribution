import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';

class Exercise extends Model {
    public idExercise!: number;
    public ExerciseName!: string;
    public ExerciseDescription!: string;
    public ExerciseNumberRepetitionsMin!: number;
    public ExerciseNumberRepetitionsMax!: number;
    public ExerciseDescriptionURL!: string | null;
}

Exercise.init(
    {
        idExercise: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: false,
        },
        ExerciseName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ExerciseDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ExerciseNumberRepetitionsMin: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ExerciseNumberRepetitionsMax: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ExerciseImageURL: {
            type: DataTypes.STRING,
        },
        ExerciseDescriptionURL: {
            type: DataTypes.STRING,
        },
        ExerciseSeanceURL: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: 'Exercise',
        tableName: 'Exercise',
        timestamps: false,
    }
);

export default Exercise;