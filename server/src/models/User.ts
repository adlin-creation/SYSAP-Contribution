import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';

class User extends Model {
    public idUser!: number;
    public Name!: string;
    public FamilyName!: string;
    public Email!: string;
    public Password!: string;
    public ProgramId!: number | null; // Foreign key to Program
}

User.init(
    {
      idUser: {
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
      ProgramId: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: 'User',
      sequelize: sequelize,
    }
  );
  
  export default User;