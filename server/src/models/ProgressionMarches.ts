import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';
import Patient from "./Patient";


class ProgressionMarches extends Model {
    public ID!: number;
    public idPatient!: number;
    public NbSemaines!: number;
    public Marche!: number;
}
ProgressionMarches.init({
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
    NbSemaines: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    Marche: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    }
}, {
    tableName: 'ProgressionMarche',
    timestamps: false,
    sequelize: sequelize,
});

export default ProgressionMarches;