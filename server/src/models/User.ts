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
      tableName: 'User', // Set the table name (optional)
      sequelize: sequelize, // Pass your Sequelize instance
    }
  );
  
  // Create or sync the table (if it doesn't exist) using sequelize.sync() or migrations
  
  export default User;