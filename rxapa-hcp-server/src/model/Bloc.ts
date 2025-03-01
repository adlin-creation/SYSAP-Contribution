import { sequelize, dataTypes } from "../util/database";

/**
 * Creates a Bloc model (Table) - A Bloc is a sequence of exercises to be done in sequence,
 * “in one sitting”. A bloc may consist of “do one series of sit-ups,
 * followed by 2 minutes of rest, followed by 10 minutes of walking,
 * following by two series of push-ups”
 */
export const Bloc = sequelize.define("Bloc", {
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
});
