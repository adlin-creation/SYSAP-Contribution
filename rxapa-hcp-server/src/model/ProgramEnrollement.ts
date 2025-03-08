import { sequelize, dataTypes } from "../util/database";

/**
 * Creates a program enrollement model, which translates to a table in the database.
 * Each attribute of this model represents a column in the table.
 */
export const ProgramEnrollement = sequelize.define("ProgramEnrollement", {
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
  enrollementDate: {
    type: dataTypes.DATE,
    allowNull: false,
  },
  startDate: {
    type: dataTypes.DATEONLY,
    allowNull: true,
  },
  endDate: {
    type: dataTypes.DATEONLY,
    allowNull: true,
  },
  programEnrollementCode: {
    type: dataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  PatientId: {
    type: dataTypes.INTEGER,
    allowNull: false,
    unique: true,
  }
});
