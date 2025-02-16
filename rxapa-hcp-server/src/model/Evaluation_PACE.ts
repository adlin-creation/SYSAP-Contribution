import { sequelize, dataTypes } from '../util/database';
import { Evaluation } from './Evaluation';

export const Evaluation_PACE = sequelize.define('Evaluation_PACE', {
  idPACE: {
    type: dataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Evaluation,
      key: 'id',
    },
  },
  // Section A
  chairTestSupport: {
    type: dataTypes.BOOLEAN,
    allowNull: false,
  },
  chairTestCount: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  // Section B
  balanceFeetTogether: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  balanceSemiTandem: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  balanceTandem: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  balanceOneFooted: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  // Section C
  frtSitting: {
    type: dataTypes.BOOLEAN,
    allowNull: false,
  },
  frtDistance: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
});