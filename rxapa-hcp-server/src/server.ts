import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
const path = require("path");

import { createAssociations } from "./model/Association";
import { initDatabase } from "./util/database";
import sessionRoutes from "./routes/SessionRoute";
import blocRoutes from "./routes/BlocRoute";
import exerciseRoutes from "./routes/ExerciseRoute";
import programRoutes from "./routes/ProgramRoute";
import cycleRoutes from "./routes/WeeklyCycleRoute";
import programPhaseRoutes from "./routes/ProgramPhaseRoute";
import userRoutes from "./routes/UserRoutes";
import programEnrollementRoutes from "./routes/ProgramEnrollementRoute";
import patientRoutes from "./routes/PatientRoute";
import patientCaregiverRoutes from "./routes/PatientCaregiverRoute";
import caregiverRoutes from "./routes/CaregiverRoute";
import professionalUserRoutes from "./routes/ProfessionalUserRoute";
import evaluationRoutes from "./routes/EvaluationRoute";

import { errorHandler } from "./middleware/errorHandler"; // Import du middleware

const app = express();

// //Reads .env file and makes it accessible via process.env
dotenv.config();

app.use(cookieParser()); // Ajouté pour lire les cookies côté backend (CSRF)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true, // Autorise les cookies + en-têtes personnalisés
  })
);

/*app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});*/

// Static Image Serving
const mimeTypes = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'webp': 'image/webp'
};

app.use("/images", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
}, express.static("images", {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase().slice(1) as keyof typeof mimeTypes; // Déclare ext comme clé de mimeTypes
    if (mimeTypes[ext]) {
      res.set('Content-Type', mimeTypes[ext]);
    }
  }
}));

app.use(userRoutes);
app.use(exerciseRoutes);
app.use(blocRoutes);
app.use(sessionRoutes);
app.use(cycleRoutes);
app.use(programPhaseRoutes);
app.use(programRoutes);
app.use(programEnrollementRoutes);
app.use(patientRoutes);
app.use(patientCaregiverRoutes);
app.use(caregiverRoutes);
app.use(professionalUserRoutes);
app.use(evaluationRoutes);

// app.use("/", programPhaseRoutes);

app.use("*", function (req, res) {
  res.send("The page doesn't exist");
});

app.use(errorHandler); // Utilisation du middleware de gestion des erreurs

configureDatabase();
/**
 * Initialize the database and then starts the application server.
 */
async function configureDatabase() {
  // create association between models
  createAssociations();
  try {
    // intitialize the database
    await initDatabase();

    app.listen(process.env.PORT || 80, () => {
      console.log(`Server started on port ${process.env.PORT || 80}`);
    });
  } catch (error: any) {
    throw new Error(error);
  }
}

// Exportation de app pour les tests et autres modules
export default app;