import { sequelize, dataTypes } from "../util/database";

/**
 * Creates an Exercise Day Session model (Table) - Represents the exercise schedule/program
 * for a day. A session consists of 1 or more blocs typically occurring at different times
 * of the day. In case of several ‘blocs’, they can be repeats of the same bloc (‘same recipe)
 * or different blocs (‘different recipes’)
 */
export const Session = sequelize.define("Session", {
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
    allowNull: false,
  },
  constraints: {
    type: dataTypes.STRING,
    allowNull: true,
  },
});
