import { sequelize, dataTypes } from "../util/database";

/**
 * Creates a variant of an exercise, which translates to a table in the database.
 * Each attribute of this model represents a column in the table.
 */
export const Variant = sequelize.define("Variant", {
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
  fitnessLevel: {
    type: dataTypes.ENUM(
      "Facile",
      "Intermédiaire",
      "Avancé"
    ),
    allowNull: false,
  },
});
