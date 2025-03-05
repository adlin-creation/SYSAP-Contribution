import { sequelize, dataTypes } from "../util/database";
/**
 * Creates a patient model, which translates to a table in the database.
 * Each attribute of this model represents a column in the table.
 */
export const Patient = sequelize.define("Patient", {
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
  firstname: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  birthday: {
    type: dataTypes.DATEONLY,
    allowNull: true,
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
  otherinfo: {
    type: dataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: dataTypes.ENUM('active', 'paused', 'waiting', 'completed', 'abort'),
    allowNull: false,
  },
  numberOfPrograms: {
    type: dataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  numberOfCaregivers: {
    type: dataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  weight: {
    type: dataTypes.FLOAT,
    allowNull: true, // Optionnel
  },
  weightUnit: {
    type: dataTypes.ENUM('kg', 'lbs'),
    allowNull: true, // Optionnel
  },
  unikPassHashed: {
    type: dataTypes.INTEGER,
    allowNull: true,
  },

});


