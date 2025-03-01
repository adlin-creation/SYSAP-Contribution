// This code is adapted from the 'goldfit-hcp-server' project
// Project: https://github.com/Hyacinth-Ali/goldfit-hcp-server
// Original Author: Hyacinth Ali
// License: ISC

const { Sequelize, DataTypes, Model } = require("sequelize");
import * as dotenv from 'dotenv';

dotenv.config({ path: './src/config/config.env' });

let isDBConnected = false;
console.log(process.env.DB_STORAGE);

/**
 *
 *
 * Creates new sequelize instance, which is used to create data
 * models.
 */
export const sequelize = new Sequelize(
  {
    dialect: "sqlite",
    storage: process.env.DB_STORAGE,
  }
);

export const dataTypes = DataTypes;

/**
 *
 * @returns Initialize database
 */
export async function initDatabase() {
  try {
    await sequelize.sync();
    console.log("CONNECTED TO THE DATABASE");
    isDBConnected = true;
  } catch (error) {
    console.log("FAILED TO CONNECT TO THE DATABASE");
    console.log(error);
    throw new Error("FAILED TO CONNECT TO THE DATABASE");
  }
}

export function isDatabaseInitialized() {
  return isDBConnected;
}

export async function dropDatabase() {
  await sequelize.drop();
}

export async function findAllInstances(model: typeof Model) {
  return model.findAll();
}
