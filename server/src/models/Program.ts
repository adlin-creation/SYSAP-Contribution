import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';

class Program extends Model {
    public idProgram!: number;
    public ProgramName!: string;
    public ProgramDescription!: string;
    public ProgramDuration!: number;
}

Program.init(
    {
        idProgram: {
            type: DataTypes.SMALLINT,
            primaryKey: true,
            autoIncrement: false,
        },
        ProgramName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ProgramDescription: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ProgramDuration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Program',
        tableName: 'Program',
        timestamps: false,
    }
);

export default Program;