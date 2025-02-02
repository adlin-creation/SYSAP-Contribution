import { sequelize, dataTypes } from "../util/database";

/**
 * Creates a program model, which translates to a table in the database.
 * Each attribute of this model represents a column in the table.
 */
export const Program = sequelize.define("Program", {
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
    unique: true,
  },
  description: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
});
