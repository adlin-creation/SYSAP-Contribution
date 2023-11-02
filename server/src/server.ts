import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import logRequest from './utils/requestLogger';
import * as dotenv from 'dotenv';

// Loads variables from config file
dotenv.config({ path: './config/config.env' });

const app: Application = express();

// Request logger
app.use(logRequest);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Max requests per window
});
app.use(limiter);

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cross Origin Resource Sharing
app.use(cors({
  origin: '*',
  credentials: false,
}));

// Routes
import exerciseRoutes from './routes/exerciseRoutes';
import patientRoutes from './routes/patientRoutes';
app.use('/api/exercises', exerciseRoutes);
app.use('/api/patients', patientRoutes);

// Server port
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
