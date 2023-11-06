import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';

class User extends Model {
    public id!: number;
    public name!: string;
    public familyName!: string;
    public email!: string;
    public password!: string;
    public programName!: string | null;
}

User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      familyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      programName: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'User',
      sequelize: sequelize,
    }
  );
  
  sequelize.sync()
  .then(() => {
    console.log('User table synchronized successfully.');
  })
  .catch((err) => {
    console.error('Error synchronizing User table:', err);
  });
  
  export default User;