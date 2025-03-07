import { sequelize, dataTypes } from "../util/database";
import { Evaluation } from "./Evaluation";

export const Evaluation_PATH = sequelize.define("Evaluation_PATH", {
  idPATH: {
    type: dataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Evaluation,
      key: "id",
    },
  },
  // Section Cardio-musculaire
  chairTestSupport: {
    type: dataTypes.STRING,
    allowNull: false,
  },
  chairTestCount: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  scoreCM: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  // Section Equilibre
  BalanceFeetTogether: {
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
  scoreBalance: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  // Score total
  scoreTotal: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  // Objectif de marche
  vitesseDeMarche: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
  objectifMarche: {
    type: dataTypes.INTEGER,
    allowNull: false,
  },
});
