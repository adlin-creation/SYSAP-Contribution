import { sequelize, dataTypes } from "../util/database";
import { Patient } from './Patient';
import { Kinesiologist } from './Kinesiologist';

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
  idPatient: {
    type: dataTypes.INTEGER,
    references: {
      model: Patient,
      key: 'id',
    },
  },
  idKinesiologist: {
    type: dataTypes.INTEGER,
    references: {
      model: Kinesiologist,
      key: 'idKinesiologist',
    },
  },
  idResultProgram: {
    type: dataTypes.STRING,
    allowNull: true,
  },
});