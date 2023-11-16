import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';
import Patient from "./Patient";

class ProgressionExercices extends Model {
    public ID!: number;
    public idPatient!: number;
    public NbSeances!: number;
    public DiffMoyenne!: number;
    public NbSemaines!: number;
    public NbObjectifs!: number;
    public NumProgramme!: number;
}

ProgressionExercices.init({
    ID: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    idPatient: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: Patient,
            key: 'idPatient',
        },
    },
    NbSeances: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    DiffMoyenne: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    NbSemaines: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    NbObjectifs: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    NumProgramme: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
}, {
    tableName: 'progressionExercices',
    timestamps: false,
    sequelize: sequelize,
});

export default ProgressionExercices;
