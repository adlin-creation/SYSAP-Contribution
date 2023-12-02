import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';

class Caregiver extends Model {
    public id!: number;
    public FirstName!: string;
    public LastName!: string;
    public Email!: string;
    public Password!: string;
}

Caregiver.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
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
    tableName: 'Caregiver',
    sequelize: sequelize,
  }
);

export default Caregiver;