import { sequelize, dataTypes } from "../util/database";

/**
 * Creates a patient_caregiver model, which translates to a table in the database.
 * Each attribute of this model represents a column in the table.
 */
export const Patient_Caregiver = sequelize.define("Patient_Caregiver", {
  id: {
    type: dataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  date: {
    type: dataTypes.DATE,
    allowNull: false,
  },
});
