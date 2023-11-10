import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/database';

class ProgramDayRecord extends Model {
    public idProgramDayRecord!: number;
    public Date!: Date;
    public UserId!: number;
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
        UserId: {
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