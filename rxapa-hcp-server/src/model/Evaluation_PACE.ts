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
    type: dataTypes.STRING,
    allowNull: false,
  },
  chairTestCount: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  scoreA: {
    type: dataTypes.INTEGER,
    allowNull:false,
  },
  // Section B
  balanceFeetTogether: {
    type: dataTypes.DOUBLE,
    allowNull: false,
  },
  balanceSemiTandem: {
    type: dataTypes.DOUBLE,
    allowNull: false,
  },
  balanceTandem: {
    type: dataTypes.DOUBLE,
    allowNull: false,
  },
  balanceOneFooted: {
    type: dataTypes.DOUBLE,
    allowNull: false,
  },
  scoreB: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  // Section C
  frtSitting: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  frtDistance: {
    type: dataTypes.DOUBLE,
    allowNull: false,
  },
  scoreC: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  // score total
  scoreTotal: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  // objectif de marche
  vitesseDeMarche: {
    type: dataTypes.DOUBLE,
    allowNull: false,
  },
  objectifMarche: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
});