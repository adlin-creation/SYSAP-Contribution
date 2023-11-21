import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createAssociations } from './models/Associations';
import { initDatabase } from './db/database';
import * as dotenv from 'dotenv';

dotenv.config({ path: './src/config/config.env' });

const app: Application = express();

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
  origin: process.env.CLIENT_URL,
  credentials: false,
}));

// Routes
import exerciseRoutes from './routes/exerciseRoutes';
import authRoutes from './routes/authRoutes';
import programRoutes from './routes/programRoutes';
import impressionRoutes from './routes/impressionRoutes';
import progressRoutes from './routes/progressRoutes';
import patientRoutes from "./routes/patientRoutes";
app.use('/api/exercises', exerciseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/print', impressionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/patient', patientRoutes)



configureDatabase();
async function configureDatabase() {
  // create association between models
  createAssociations();
  try {
    // intitialize the database
    await initDatabase();
  } catch (error: any) {
    throw new Error(error);
  }
}

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});