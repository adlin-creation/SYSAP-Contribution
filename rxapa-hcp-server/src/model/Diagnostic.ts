import { sequelize, dataTypes } from "../util/database";

export const Diagnostic = sequelize.define("Diagnostic", {
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
  description: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: dataTypes.DATE,
    allowNull: false,
  },
});
