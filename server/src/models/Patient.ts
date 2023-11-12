import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';

class Patient extends Model {
    public idPatient!: number;
    public Name!: string;
    public FamilyName!: string;
    public Email!: string;
    public Password!: string;
    public ProgramName!: string | null; // Foreign key to Program
}

Patient.init(
    {
      idPatient: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      FamilyName: {
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
      ProgramName: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'Patient',
      sequelize: sequelize,
    }
  );
  
  export default Patient;