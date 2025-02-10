import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';

class Reminder extends Model {
    public idReminder!: number;
    public NextReminder!: Date;
    public Frequency!: number;
    public UserId!: number;
}

Reminder.init(
    {
        idReminder: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        NextReminder: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        Frequency: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        },
    {
        tableName: 'Reminder',
        sequelize: sequelize,
    }
  );
  
  export default Reminder;