import { sequelize, dataTypes } from "../util/database";

/**
 * Creates an exercise version model, which translates to a table in the database.
 * Each attribute of this model represents a column in the table.
 */
export const ExerciseVersion = sequelize.define("ExerciseVersion", {
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
  numberOfRepitions: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  instructionalVideo: {
    type: dataTypes.STRING,
    allowNull: false,
  },
});
