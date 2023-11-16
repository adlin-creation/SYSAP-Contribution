// idProgramEnrollment SMALLINT(2)
// • Patientld SMALLINT(2)
// Programid SMALLINT(2)
// ProgramEnrollmentDate DATE
// ProgramStartDate DATE
// ProgramEnrollmentCode VARCHAR(45)

import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/database";

class ProgramEnrollment extends Model {
    public idProgramEnrollment!: number;
    public Patientld!: number;
    public ProgramName!: string;
    // public ProgramEnrollmentDate?: Date;
    // public ProgramStartDate?: Date;
    // public ProgramEnrollmentCode?: string;
}

ProgramEnrollment.init(
    {
        idProgramEnrollment: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        Patientld: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ProgramName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // ProgramEnrollmentDate: {
        //     type: DataTypes.DATE,
        // },
        // ProgramStartDate: {
        //     type: DataTypes.DATE,
        // },
        // ProgramEnrollmentCode: {
        //     type: DataTypes.STRING,
        // },
    },
    {
        sequelize,
        tableName: "ProgramEnrollment",
        timestamps: false,
    }
);

export default ProgramEnrollment;