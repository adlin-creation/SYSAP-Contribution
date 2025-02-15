/*import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  user: 'postgres',
  password: 'goldfit',
  host: 'postgres',
  port: 5432,
  database: 'postgres',
  ssl: false
});

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    console.log('Connection parameters:', {
      host: 'postgres',
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: 'goldfit',
    });
    
    await client.connect();
    console.log("Successfully connected to database");
    
    const result = await client.query('SELECT version()');
    console.log("PostgreSQL version:", result.rows[0].version);
  } catch (err) {
    console.error("Detailed connection error:", err);
  } finally {
    await client.end();
  }
}

testConnection();*/
