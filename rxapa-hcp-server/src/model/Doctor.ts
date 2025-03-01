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
}, {
  modelName: 'Doctor',
});

export { Doctor };
