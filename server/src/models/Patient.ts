import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';

class Patient extends Model {
  public idPatient!: number;
  public PatientFirstName!: string;
  public PatientLastName!: string;
  public Email!: string;
  public Password!: string;

  async getPatientById(id: Number) {
    let p = Patient.findByPk(String(id))
        .then(patient => {
            if (!patient) {
                return { error: 'Patient not found' };
            }
            console.log(patient);
            return {
                firstName: patient!.PatientFirstName,
                lastName: patient!.PatientLastName,
            }
        })
    return p;
}

}

Patient.init(
  {
    idPatient: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    PatientFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PatientLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'Patient',
    sequelize: sequelize,
  }
);

export default Patient;