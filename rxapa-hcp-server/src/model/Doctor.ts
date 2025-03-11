import { sequelize, dataTypes } from '../util/database';
import { Professional_User } from './Professional_User';

const Doctor = sequelize.define('Doctor', {
  idDoctor: {
    type: dataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Professional_User,
      key: 'id',
    },
  },
  key: {
    type: dataTypes.UUID,
    defaultValue: dataTypes.UUIDV4,
  },
  workEnvironment: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  unikPassHashed: {
    type: dataTypes.STRING,
    allowNull: true,
  },

}, {
  modelName: 'Doctor',
});

export { Doctor };
