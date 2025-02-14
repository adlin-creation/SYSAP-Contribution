// objectif: tester la connexion à la base de données PostgreSQL
const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    password: 'goldfit',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
});

(async () => {
    try {
        await client.connect();
        console.log('Connected to database');

        // Requête SQL avec schéma explicite
        const query = `
            SELECT * 
            FROM goldfit.programenrollment 
            WHERE programenrollmentcode = $1
        `;
        const result = await client.query(query, ['HA-01']);
        console.log('Query result:', result.rows);
    } catch (err) {
        console.error('Database error:', err);
    } finally {
        await client.end();
    }
})();
