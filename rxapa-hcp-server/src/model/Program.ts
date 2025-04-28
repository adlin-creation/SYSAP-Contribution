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
    allowNull: false,
    unique: true,
  },
  name: {
    type: dataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: dataTypes.STRING(500),
    allowNull: false,
  },
  duration: {
    type: dataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1, // Durée doit être ≥ 1 jour/semaine
    },
  },
  duration_unit: {
    type: dataTypes.ENUM("days", "weeks"),
    allowNull: false,
  },
  image: {
    type: dataTypes.STRING, // Stocke soit une URL, soit un chemin de fichier
    allowNull: true,
  },
  actif: {
    type: dataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true, // ou false selon la logique par défaut
  }
});