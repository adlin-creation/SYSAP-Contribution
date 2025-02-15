// objective: This file is the entry point for the Express application. It initializes the application, sets up middleware, and defines routes for the application.
// objective: Ce fichier est le point d'entrée de l'application Express. Il initialise l'application, configure les middleware et définit les routes de l'application.
import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoute';
import sessionRecordRoute from './routes/sessionRecordRoute';
import patientStatisticsRoute from './routes/patientStatisticsRoute';
import sessionRoutes from './routes/sessionRoute';

/**
 * Initializes the Express application.
 */
const app = express();

/**
 * Middleware to enable Cross-Origin Resource Sharing (CORS).
 */
app.use(cors());

/**
 * Middleware to parse incoming JSON requests.
 */
app.use(express.json());

/**
 * Health check route to ensure the server is running.
 */
app.get('/api/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'API is running' });
  });

/**
 * Routes for authentication-related endpoints.
 */
app.use('/api', authRouter);

/**
 * Routes for session record-related endpoints.
 */
app.use('/api', sessionRecordRoute);



/**
 * Routes for patient statistics endpoints.
 */
app.use('/api', patientStatisticsRoute);
/**
 * Routes for session-related endpoints.
 */
app.use('/api', sessionRoutes);
export default app;