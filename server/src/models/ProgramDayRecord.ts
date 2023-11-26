import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/database';

class ProgramDayRecord extends Model {
    public idProgramDayRecord!: number;
    public Date!: Date;
    public ProgramEnrollmentId!: number;
}

ProgramDayRecord.init(
    {
        idProgramDayRecord: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: false,
        },
        Date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        ProgramEnrollmentId: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'ProgramDayRecord',
        tableName: 'ProgramDayRecord',
        timestamps: false,
    }
);

export default ProgramDayRecord;