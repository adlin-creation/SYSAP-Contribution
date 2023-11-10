import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/database';

class Patient extends Model {
    public idPatient!: number;
    public PatientFirstName!: string;
    public PatientLastName!: string;
}

Patient.init(
    {
      idPatient: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: false,
      },
      PatientFirstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PatientLastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Patient',
      tableName: 'Patient',
      timestamps: false,
    }
);

 export default Patient;