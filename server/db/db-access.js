const sqlite3 = require('sqlite3').verbose();

const dbPath = './db/sysap.db';

const db = new sqlite3.Database(dbPath);

module.exports = db;
