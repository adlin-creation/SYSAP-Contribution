import request from 'supertest';
import app from '../../src/app';
import { dbClient } from '../../src/database';

// Mock du client de base de données
jest.mock('../../src/database', () => ({
  dbClient: {
    query: jest.fn(),
  },
}));

describe('AuthController - authenticate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if no code is provided', async () => {
    const response = await request(app).post('/api/authenticate').send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'Le code est requis',
    });
  });

  it('should return 401 if the code is invalid', async () => {
    (dbClient.query as jest.Mock).mockResolvedValueOnce({ rows: [], rowCount: 0 });

    const response = await request(app).post('/api/authenticate').send({ programEnrollementCode: 'invalid-code' });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      message: 'Code invalide',
    });
  });

  it('should return 200 and user information if the code is valid', async () => {
    const mockResult = {
      rows: [
        {
          programEnrollementId: 1,
          firstname: 'John',
          lastname: 'Doe',
          programName: 'Fitness Program',
          startDate: new Date('2024-01-01'),
          duration: 30,
        },
      ],
      rowCount: 1,
    };

    (dbClient.query as jest.Mock).mockResolvedValueOnce(mockResult);

    const response = await request(app).post('/api/authenticate').send({ programEnrollementCode: 'valid-code' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Authentification réussie',
      token: 'some-token',
      userType: 'user',
      data: {
        programEnrollementId: 1,
        fullName: `Bonjour John Doe`,
        programName: `Bienvenue dans le programme Fitness Program`,
        currentDay: `Jour ${Math.ceil((new Date().getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)) + 1} de 30`,
      },
    });
  });

  it('should return 500 if there is a server error', async () => {
    (dbClient.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).post('/api/authenticate').send({ programEnrollementCode: 'valid-code' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: 'Erreur interne du serveur',
    });
  });
});
