import { sequelize, dataTypes } from "../util/database";
import { Patient } from './Patient';
import { Kinesiologist } from './Kinesiologist';
import { Program } from './Program';

/**
 * Creates an Evaluation model (Table)
 */
export const Evaluation = sequelize.define("Evaluation", {
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
});