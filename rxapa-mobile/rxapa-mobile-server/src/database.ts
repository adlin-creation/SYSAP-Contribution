// objectif: Connexion à la base de données PostgreSQL
// // objective: Connect to PostgreSQL database
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const dbClient = new Client({
  user: 'postgres',
  password: '',
  //host: '10.10.10.141',192.168.0.48,10.61.0.197
  // host: '192.168.0.80',
  // port: 5433,
  database: 'rxapa', // Nouvelle base de données
  ssl: false
});

dbClient.connect()
  .then(async () => {
    console.log('Database connected successfully');
    
    // Définit le search_path pour la session
    await dbClient.query('SET search_path TO rxapa, public;');
    console.log('Search_path set to rxapa, public');
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });
  export default dbClient;