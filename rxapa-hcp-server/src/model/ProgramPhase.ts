import { sequelize, dataTypes } from "../util/database";

/**
 * Creates a program phase model, which translates to a table in the database.
 * Each attribute of this model represents a column in the table.
 */
export const ProgramPhase = sequelize.define("ProgramPhase", {
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
  startConditionType: {
    type: dataTypes.ENUM("TimeElapsed", "PerformanceGoal"),
    allowNull: false,
  },
  startConditionValue: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  endConditionType: {
    type: dataTypes.ENUM("TimeElapsed", "PerformanceGoal"),
    allowNull: false,
  },
  endConditionValue: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  frequency: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: dataTypes.BOOLEAN,
    defaultValue: false,
  },
});
