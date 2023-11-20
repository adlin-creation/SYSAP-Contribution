import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';
import Patient from "./Patient";


class ProgressionMarches extends Model {
    public ID!: number;
    public idPatient!: number;
    public NbSemaines!: number;
    public Marche!: number;
    public NbMarches!: number;
}
ProgressionMarches.init({
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
    NbSemaines: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Marche: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    NbMarches:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'ProgressionMarche',
    timestamps: false,
    sequelize: sequelize,
});

export default ProgressionMarches;