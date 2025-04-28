import { DataTypes } from "sequelize";
import { sequelize } from "../util/database";

/**
 * This model is used to track and store the history of modifications made to a Bloc,
 */
export const BlocHistory = sequelize.define("BlocHistory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  blocId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  field: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  oldValue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  newValue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});
