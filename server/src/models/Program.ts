import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';

class Program extends Model {
    public ProgramName!: string;
    public ProgramDescription!: string;
    public ProgramDuration!: number;
}

Program.init(
    {
        ProgramName: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: false,
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