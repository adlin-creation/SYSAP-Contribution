import { sequelize, dataTypes } from "../util/database";

/**
 * Creates a Bloc_Session model (Table), which connects Bloc with Session.
 */
export const Bloc_Session = sequelize.define("Bloc_Session", {
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
  rank: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  required: {
    type: dataTypes.BOOLEAN,
  },
  dayTime: {
    type: dataTypes.ENUM(
      "MORNING",
      "AFTERNOON",
      "EVENING",
      "NIGHT",
      "NOT APPLICABLE"
    ),
    allowNull: false,
  },
});
