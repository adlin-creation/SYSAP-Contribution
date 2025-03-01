import { sequelize, dataTypes } from "../util/database";

/**
 * Creates a User model (Table)
 */
export const User = sequelize.define("User", {
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
  name: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: dataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: dataTypes.STRING,
    allowNull: false,
  },
});
