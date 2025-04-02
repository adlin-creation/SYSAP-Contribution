import { sequelize, dataTypes } from "../util/database";

/**
 * Creates an Exercise model (Table)
 */
export const Exercise = sequelize.define("Exercise", {
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
  imageUrl: {
    type: dataTypes.STRING,
  },
  videoUrl: {
    type: dataTypes.STRING,
  },
  category: {
    type: dataTypes.ENUM("Aérobique", "Endurance", "Force", "Flexibilité", "Équilibre"),
    allowNull: false,
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
