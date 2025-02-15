import { sequelize, dataTypes } from "../util/database";
import { Patient } from './Patient';
import { Kinesiologist } from './Kinesiologist';
import { Program } from './Program';

/**
 * Creates an Evaluation model (Table)
 */
export const Exercise = sequelize.define("Exercise", {
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
      key: 'id',
    },
  },
  idResultProgram: {
    references: {
      model: Program,
      key: 'id',
    },
  },
});