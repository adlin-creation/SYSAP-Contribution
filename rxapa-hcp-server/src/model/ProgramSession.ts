import { sequelize } from "../util/database";
import { DataTypes } from "sequelize";

/**
 * Table de jonction entre Program et Session.
 */
export const ProgramSession = sequelize.define("ProgramSession", {
  programId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: "Programs", 
      key: "id",
    },
  },
  sessionId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: "Sessions", 
      key: "id",
    },
  },
});