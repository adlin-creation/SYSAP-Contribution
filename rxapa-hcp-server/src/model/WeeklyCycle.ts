import { sequelize, dataTypes } from "../util/database";

/**
 * Creates a Weekly_Cycle model (Table) - Represents the exercise schedule for a week.
 * We can have the same session every day of the week, and require that the patient does
 * that one session 4 days out of seven, or specific days of the week,
 * or do a different session for each day, or three different sessions any
 * three days of the week, etc.
 */
export const WeeklyCycle = sequelize.define("WeeklyCycle", {
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
  },
  isSessionsFlexible: {
    type: dataTypes.BOOLEAN,
  },
});
