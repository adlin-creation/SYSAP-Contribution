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
  CaregiverId: {
    type: dataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Caregivers', // Le nom du modèle référencé
      key: 'id', // La clé primaire du modèle référencé
    }
  },
  ProgramEnrollementId: {
    type: dataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ProgramEnrollements', // Le nom du modèle référencé
      key: 'id', // La clé primaire du modèle référencé
    }
  }
});
