import { sequelize, dataTypes } from '../util/database';
import { Professional_User } from './Professional_User';

const Kinesiologist = sequelize.define('Kinesiologist', {
  idKinesiologist: {
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

}, {
  modelName: 'Kinesiologist',
});

export { Kinesiologist };
