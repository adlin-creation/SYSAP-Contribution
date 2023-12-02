import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db/database';
import Patient from './Patient';
import CareGiver from './Caregiver';

class PatientCaregiver extends Model {
    public idPatientCaregiver!: number;
    public patient_id!: number;
    public caregiver_id!: number;
}

PatientCaregiver.init(
    {
        idPatientCareGiver: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        patient_id: {
          type: DataTypes.INTEGER,
          references: {
              model: 'Patient', // Replace with the actual table name of Patient
              key: 'id', // Replace with the actual primary key of Patient
          },
      },
      caregiver_id: {
          type: DataTypes.INTEGER,
          references: {
              model: 'Caregiver', // Replace with the actual table name of CareGiver
              key: 'id', // Replace with the actual primary key of CareGiver
          },
      },
    },
    {
      tableName: 'PatientCaregiver',
      sequelize: sequelize,
      timestamps: false
    }
  );

export default PatientCaregiver;