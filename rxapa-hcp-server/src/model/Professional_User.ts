import { sequelize, dataTypes } from '../util/database';

const Professional_User = sequelize.define('Professional_User', {
  id: {
    type: dataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  key: {
    type: dataTypes.UUID,
    defaultValue: dataTypes.UUIDV4,
  },
  firstname: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: dataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: dataTypes.ENUM('admin', 'doctor', 'kinesiologist'),
    allowNull: false,
  },
  active: {
    type: dataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  modelName: 'Professional_User',
});

export { Professional_User };
