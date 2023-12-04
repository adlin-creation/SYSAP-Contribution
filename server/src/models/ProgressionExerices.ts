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
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    idPatient: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Patient,
            key: 'idPatient',
        },
    },
    NbSeances: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    DiffMoyenne: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    NbSemaines: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    NbObjectifs: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    NumProgramme: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'progressionExercices',
    timestamps: false,
    sequelize: sequelize,
});

export default ProgressionExercices;
