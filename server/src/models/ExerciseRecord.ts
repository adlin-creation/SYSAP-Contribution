import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';

class ExerciseRecord extends Model {
    public idExerciseRecord!: number;
    public NumberSeries!: number;
    public NumberRepetitions!: number;
    public ProgramDayRecordId!: number;
    public ExerciseId!: number;
}

ExerciseRecord.init(
    {
        idExerciseRecord: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: false,
        },
        NumberSeries: {
            type: DataTypes.SMALLINT,
        },
        NumberRepetitions: {
            type: DataTypes.SMALLINT,
        },
        ProgramDayRecordId: {
            type: DataTypes.SMALLINT,
        },
        ExerciseId: {
            type: DataTypes.SMALLINT,
        },
    },
    {
        sequelize,
        modelName: 'ExerciseRecord',
        tableName: 'ExerciseRecord',
        timestamps: false,
    }
);

export default ExerciseRecord;