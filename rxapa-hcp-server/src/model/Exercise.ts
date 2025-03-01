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
  instructionalVideo: {
    type: dataTypes.STRING,
  },
  imageUrl: {
    type: dataTypes.STRING,
  },
  isSeating: {
    type: dataTypes.BOOLEAN,
    allowNull: false,
  },
  category: {
    type: dataTypes.ENUM("AEROBIC", "STRENGHT", "ENDURANCE", "FLEXIBILITY"),
    allowNull: false,
  },
  targetAgeRange: {
    type: dataTypes.ENUM(
      "FIFTY_TO_FIFTY_NINE",
      "SIXTY_TO_SIXTY_NINE",
      "SEVENTY_TO_SEVENTY_NINE",
      "EIGHTY_TO_EIGHTY_NINE"
    ),
    allowNull: false,
  },
  fitnessLevel: {
    type: dataTypes.ENUM(
      "LOW",
      "BELOW_AVERAGE",
      "AVERAGE",
      "ABOVE_AVERAGE",
      "HIGH"
    ),
    allowNull: false,
  },
});
