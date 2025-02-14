import request from 'supertest';
import app from '../../src/app'; // Application Express configurée
import { dbClient } from '../../src/database'; // Mock de la base de données

// Mock de la base de données
jest.mock('../../src/database', () => ({
  dbClient: {
    query: jest.fn(),
  },
}));

describe('AuthRoute Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no code is provided', async () => {
    const response = await request(app).post('/api/authenticate').send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Le code est requis');
  });

  it('should return 401 if the code is invalid', async () => {
    // Simulez une réponse SQL pour un code invalide
    (dbClient.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0, rows: [] });

    const response = await request(app)
      .post('/api/authenticate')
      .send({ programEnrollementCode: 'INVALID-CODE' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Code invalide');
  });

  it('should return 200 for a valid code', async () => {
    // Simulez une réponse SQL pour un code valide
    (dbClient.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          programEnrollementId: 1,
          firstname: 'Jane',
          lastname: 'Doe',
          programName: 'Wellness Program',
          startDate: '2024-01-01T00:00:00.000Z',
          duration: 30,
        },
      ],
    });

    const response = await request(app)
      .post('/api/authenticate')
      .send({ programEnrollementCode: 'CODE-123' });// code d'authentification valide

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Authentification réussie',
      token: 'some-token',
      userType: 'user',
      data: {
        programEnrollementId: 1,
        fullName: 'Bonjour Jane Doe',
        programName: 'Bienvenue dans le programme Wellness Program',
        currentDay: expect.any(String),
      },
    });
  });
});
