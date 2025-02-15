
/*import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class ProgramEnrollement extends Model {
    public id!: number;
    public key!: string;
    public enrollementDate!: Date;
    public startDate!: Date;
    public endDate!: Date;
    public programEnrollementCode!: string;
    public ProgramId!: number;
    public PatientId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ProgramEnrollement.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    key: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    enrollementDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    programEnrollementCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    ProgramId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    PatientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'Program_Enrollements',
    timestamps: true,
});*/