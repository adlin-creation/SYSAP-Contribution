import express from "express";
import dotenv from "dotenv";
const path = require("path");
// Handles binary (files) data
import multer from "multer";

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

const bodyParser = require("body-parser");

// image storage configuration object
const imageStorage = multer.diskStorage({
  // image destination function
  destination: (req: any, file, cb) => {
    // null should the error message response; otherwise, store the image in
    // images folder
    cb(null, "images");
  },
  // image name function
  // null should the error message response; otherwise, store the image
  // with current timesatmp and the origunal image name
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// filter files to be accepted as an image
const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// //Reads .env file and makes it accessible via process.env
dotenv.config();

app.use(bodyParser.json());
app.use(
  multer({ storage: imageStorage, fileFilter: fileFilter }).single(
    "exerciseImage"
  )
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

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
