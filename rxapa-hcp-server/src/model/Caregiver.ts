import { sequelize, dataTypes } from "../util/database";

/**
 * Creates a caregiver model, which translates to a table in the database.
 * Each attribute of this model represents a column in the table.
 */
export const Caregiver = sequelize.define("Caregiver", {
  id: {
    type: dataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
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
  relationship: {
    type: dataTypes.ENUM('parent', 'sibling', 'friend', 'other'),
    allowNull: false,
  },
  active: {
    type: dataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});



