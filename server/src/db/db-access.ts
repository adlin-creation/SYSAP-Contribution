import sqlite3 from 'sqlite3';
import path from 'path';

const dbFilename = 'goldfit.db';
const dbPath = path.join(__dirname, dbFilename);

console.log('Connecting to the database...');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected successfully');
    }
});

export default db;
