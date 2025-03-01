import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/database";

class ProgramEnrollment extends Model {
    public idProgramEnrollment!: number;
    public PatientId!: number;
    public ProgramName!: string;
    public ProgramEnrollmentDate?: Date;
    public ProgramStartDate?: Date;
    public ProgramEnrollmentCode?: string;
}

ProgramEnrollment.init(
    {
        idProgramEnrollment: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        PatientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        ProgramName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        ProgramEnrollmentDate: {
            type: DataTypes.DATE,
        },
        ProgramStartDate: {
            type: DataTypes.STRING,
        },
        ProgramEnrollmentCode: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        tableName: "ProgramEnrollment",
        timestamps: false,
    }
);

export default ProgramEnrollment;