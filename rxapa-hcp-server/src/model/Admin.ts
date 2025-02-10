import { sequelize, dataTypes } from '../util/database';
import { Professional_User } from './Professional_User';

const Admin = sequelize.define('Admin', {
  idAdmin: {
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
  modelName: 'Admin',
});

export { Admin };
