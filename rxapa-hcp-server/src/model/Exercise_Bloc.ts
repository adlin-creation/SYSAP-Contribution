import { sequelize, dataTypes } from "../util/database";

/**
 * Creates an Exercise_Bloc model (Table) - This is a join table between an exercise and a bloc.
 */
export const Exercise_Bloc = sequelize.define("Exercise_Bloc", {
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
  },
  required: {
    type: dataTypes.BOOLEAN,
  },
  numberOfSeries: {
    type: dataTypes.INTEGER,
  },
  numberOfRepetition: {
    type: dataTypes.INTEGER,
  },
  restingInstruction: {
    type: dataTypes.STRING,
  },
  minutes: {
    type: dataTypes.INTEGER,
  },
});
