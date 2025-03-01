import { sequelize, dataTypes } from '../util/database';

export const Follow_Patient = sequelize.define("Follow_Patient", {
  id: {
    type: dataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  key: {
    type: dataTypes.UUID,
    defaultValue: dataTypes.UUIDV4,
  },
  startDate: {
    type: dataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: dataTypes.DATE,
    allowNull: false,
  },
  active: {
    type: dataTypes.BOOLEAN,
    allowNull: false,
  },
});
