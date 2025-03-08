import { sequelize, dataTypes } from "../util/database";

export const User = sequelize.define(
  "User",
  {
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
    },
    email: {
      type: dataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: dataTypes.ENUM("superadmin", "admin", "doctor", "kinesiologist"),
      allowNull: false,
    },
  },
  {
    modelName: "User",
    tableName: "Users", // Nom en BDD
  }
);
