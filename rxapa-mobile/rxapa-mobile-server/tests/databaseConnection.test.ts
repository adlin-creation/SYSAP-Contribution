import dbClient from '../src/database'; 

describe('Database Connection Tests', () => {
  afterAll(async () => {
    await dbClient.end();
  });

  // Test 1 : Vérifie que la connexion à la base de données fonctionne correctement
  it('should connect to the database successfully', async () => {
    const result = await dbClient.query('SELECT 1 + 1 AS result'); // Requête simple pour tester la connexion
    expect(result.rows[0].result).toBe(2); // Vérifie que la requête retourne le bon résultat
  });

  // Test 2 : Vérifie que le search_path est correctement défini pour la session
  it('should set the search_path to rxapa, public', async () => {
    const result = await dbClient.query("SHOW search_path"); // Requête pour récupérer le search_path actuel
    expect(result.rows[0].search_path).toContain('rxapa'); // Vérifie que rxapa est dans le search_path
    expect(result.rows[0].search_path).toContain('public'); // Vérifie que public est dans le search_path
  });

  // Test 3 : Vérifie qu'une erreur est levée en cas de requête invalide
  it('should throw an error for an invalid query', async () => {
    await expect(
      dbClient.query('SELECT * FROM non_existing_table') // Requête sur une table inexistante
    ).rejects.toThrow(); // Vérifie qu'une erreur est levée
  });
});
