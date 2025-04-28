/*import express from 'express';
import { Client } from 'pg';
import { Program, Exercise, ExerciseSeries, Patient, ProgramEnrollment, ProgramDayRecord, Interval } from '../models/program';

const router = express.Router();

function getSSLConnectionOption() {
  const db_URL = process.env.DATABASE_URL;
  return db_URL?.includes('@localhost') ? false : { rejectUnauthorized: false };
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: getSSLConnectionOption(),
});

client.connect();

// Rechercher les détails d'un programme par nom
router.get('/program_details', async (req, res) => {
  const { pgm_name } = req.query;
  if (!pgm_name) return res.status(400).send({ error: 'Program name is required' });

  const query = `
    SELECT * 
    FROM goldfit.Program 
    INNER JOIN goldfit.ProgramExerciceSeries ON goldfit.Program.idProgram = goldfit.ProgramExerciceSeries.ProgramId
    INNER JOIN goldfit.ExerciceSeries ON goldfit.ProgramExerciceSeries.ExerciceSeriesId = goldfit.ExerciceSeries.idExerciceSeries
    INNER JOIN goldfit.ExerciceSeriesExercice ON goldfit.ExerciceSeries.idExerciceSeries = goldfit.ExerciceSeriesExercice.ExerciceSeriesId
    INNER JOIN goldfit.Exercice ON goldfit.ExerciceSeriesExercice.ExerciceId = goldfit.Exercice.idExercice
    WHERE goldfit.Program.ProgramName = $1;
  `;

  try {
    const result = await client.query(query, [pgm_name]);
    if (result.rows.length === 0) {
      return res.status(404).send({ error: `No program found with name: ${pgm_name}` });
    }
    // Convertir les données en une instance de Program
    const program = new Program(pgm_name, 'Description', 30);
    result.rows.forEach((row) => {
      const interval = new Interval(row.interval_min, row.interval_max);
      const exerciseSeries = new ExerciseSeries(row.series_name, row.series_description);
      const exercise = new Exercise(row.ex_name, row.ex_description, interval, new URL(row.ex_url));
      exerciseSeries.addExercice(exercise, interval, row.order);
      program.addExerciseSeries(interval, exerciseSeries);
    });
    res.status(200).send(program);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Rechercher les détails d'un patient par code d'enregistrement
router.get('/enrollment_details', async (req, res) => {
  const { ec } = req.query;
  if (!ec) return res.status(400).send({ error: 'Enrollment code is required' });

  const query = `
    SELECT idProgramEnrollment, PatientId, ProgramId, ProgramEnrollmentDate, ProgramStartDate, ProgramEnrollmentCode,
           idProgramDayRecord, date, satisfactionLevel, difficultyLevel, selfEfficacy, painLevel, motivationLevel,
           exerciseseriesid, idExerciceRecord, exerciceName, numberSeries, numberRepetitions
    FROM goldfit.ProgramEnrollment
    INNER JOIN goldfit.ProgramDayRecord ON goldfit.ProgramEnrollment.idProgramEnrollment = goldfit.ProgramDayRecord.ProgramEnrollmentId
    INNER JOIN goldfit.ExerciceRecord ON goldfit.ProgramDayRecord.idProgramDayRecord = goldfit.ExerciceRecord.ProgramDayRecordID
    INNER JOIN goldfit.Exercice ON goldfit.ExerciceRecord.ExerciceId = goldfit.Exercice.idExercice
    WHERE goldfit.ProgramEnrollment.ProgramEnrollmentCode = $1;
  `;

  try {
    const result = await client.query(query, [ec]);
    if (result.rows.length === 0) {
      return res.status(404).send({ error: `No enrollment found for code: ${ec}` });
    }

    const enrollment = new ProgramEnrollment(
      new Patient('John', 'Doe', result.rows[0].patientid),
      new Program('Program Name', 'Program Description', 30),
      ec,
      new Date(result.rows[0].programenrollmentdate),
      new Date(result.rows[0].programstartdate)
    );

    enrollment.buildEnrollmentFromEnrollmentDetailsQueryResults(result.rows, null, null);
    res.status(200).send(enrollment);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

export default router;*/
