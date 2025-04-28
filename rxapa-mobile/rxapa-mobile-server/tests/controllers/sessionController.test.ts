import request from 'supertest';
import app from '../../src/app';
import { dbClient } from '../../src/database';

jest.mock('../../src/database', () => ({
  dbClient: {
    query: jest.fn(),
  },
}));

describe('SessionController - getExercisesByProgramEnrollementId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if programEnrollementId is not provided', async () => {
    const response = await request(app).get('/api/sessions/exercises-by-program');
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: 'ProgramEnrollementId est requis',
    });
  });

  it('should return 404 if no session is found', async () => {
    (dbClient.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0, rows: [] });

    const response = await request(app).get('/api/sessions/exercises-by-program').query({ programEnrollementId: '123' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: 'Aucune session trouvée.',
    });
  });

  it('should return 404 if no exercises are found for the session', async () => {
    (dbClient.query as jest.Mock)
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: '1' }] })
      .mockResolvedValueOnce({ rowCount: 0, rows: [] });

    const response = await request(app).get('/api/sessions/exercises-by-program').query({ programEnrollementId: '123' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      message: 'Aucun exercice trouvé pour cette session.',
    });
  });

  it('should return 200 and exercises if found', async () => {
    (dbClient.query as jest.Mock)
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: '1' }] })
      .mockResolvedValueOnce({
        rowCount: 1,
        rows: [
          {
            exerciseName: 'Push-up',
            description: 'A basic push-up exercise',
            instructionalVideo: 'https://example.com/pushup.mp4',
            imageUrl: 'https://example.com/pushup.jpg',
          },
        ],
      });

    const response = await request(app).get('/api/sessions/exercises-by-program').query({ programEnrollementId: '123' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: [
        {
          exerciseName: 'Push-up',
          description: 'A basic push-up exercise',
          instructionalVideo: 'https://example.com/pushup.mp4',
          imageUrl: 'https://example.com/pushup.jpg',
        },
      ],
    });
  });

  it('should return 500 if there is a server error', async () => {
    (dbClient.query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get('/api/sessions/exercises-by-program').query({ programEnrollementId: '123' });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: 'Erreur du serveur.',
    });
  });
});
