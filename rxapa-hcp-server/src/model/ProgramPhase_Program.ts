import { sequelize, dataTypes } from "../util/database";

/**
 * Creates a ProgramPhase_Program model (Table), which connects ProgramPhase with Program.
 */
export const ProgramPhase_Program = sequelize.define("ProgramPhase_Program", {
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
});
