import session from "express-session";
var SequelizeStore = require("connect-session-sequelize")(session.Store);

const { Sequelize, DataTypes, Model } = require("sequelize");
import dotenv from "dotenv";
dotenv.config();
let isDBConnected = false;

// export const sequelize = new Sequelize(
//   process.env.DATABASE_NAME,
//   process.env.DATABASEL_USER,
//   process.env.DATABASE_PASSWORD,
//   {
//     host: process.env.DATABASE_HOST,
//     dialect: process.env.DATABASE_DIALECT,
//     port: process.env.DATABASE_PORT,
//     logging: false,
//     // dialectOptions: {
//     //   ssl: "Amazon RDS",
//     // },
//     pool: { maxConnections: 5, maxIdleTime: 30 },
//     language: "en",
//   }
// );

//
// export const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   logging: false,
// });
/**
 *
 *
 * Creates new sequelize instance, which is used to create data
 * models.
 */
export const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    // host: 'localhost',
    dialect: "postgres",
    logging: false,
  }
);

export const dataTypes = DataTypes;

/**
 *
 * @returns Initialize database
 */
export async function initDatabase() {
  try {
    /**
     * .sync() - This creates the table if it doesn't exist (and does nothing if it already exists).
     * .sync({ force: true }) - This creates the table, dropping it first if it already existed.
     * .sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc),
     * and then performs the necessary changes in the table to make it match the model.
     */
    await sequelize.sync({ alter: true });
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
