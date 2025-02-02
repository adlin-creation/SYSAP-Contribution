import { sequelize, dataTypes } from "../util/database";

/**
 * Creates a Phase_Cycle model (Table), which connects ProgramPhase with WeeklyCycle.
 */
export const Phase_Cycle = sequelize.define("Phase_Cycle", {
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
  numberOfRepetition: {
    type: dataTypes.INTEGER,
  },
});
