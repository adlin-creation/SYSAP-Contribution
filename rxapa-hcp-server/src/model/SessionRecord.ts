import { sequelize, dataTypes } from "../util/database";

export const SessionRecord = sequelize.define("SessionRecord", {
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
  difficultyLevel: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  painLevel: {
    type: dataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 4
    }
  },
  walkingTime: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  accomplishedExercice: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: dataTypes.DATE,
    allowNull: false,
  },
  ProgramEnrollementId: {
    type: dataTypes.INTEGER,
    allowNull: false,
  }
});
