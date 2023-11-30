import { Request, Response } from 'express';
import ProgramEnrollment from './../models/ProgramEnrollment';
import Program from '../models/Program';
import Patient from '../models/Patient';
import ProgramExerciseSeries from '../models/ProgramExerciseSeries';

interface ResultType {
  patient: {
    firstName: string;
    lastName: string;
    id: number;
  };
  program: {
    name: string;
    description: string;
    duration: number;
    numberExercices: number;
  };
  enrollmentCode: string;
  enrollmentDate: Date | null;
  startDate: Date | null;
}

class ProgramEnrollmentController {
  static getProgramDetailsByUserId(req: Request, res: Response): void {
    const { userId } = req.params;
    let result: ResultType = {
      patient: {
        firstName: '',
        lastName: '',
        id: -1
      },
      program: {
        name: '',
        description: '',
        duration: 0,
        numberExercices: 0
      },
      enrollmentCode: '',
      enrollmentDate: null,
      startDate: null
    };
    Patient.findByPk(userId).then(patient => {
      if (!patient) {
        res.status(404).json({ error: 'Patient not found' });
        return Promise.reject('Patient not found'); // Stop the chain
      }
      console.log(patient);
      result.patient = {
        firstName: patient!.PatientFirstName,
        lastName: patient!.PatientLastName,
        id: patient!.idPatient
      }

      return ProgramEnrollment.findOne({
        where: { PatientId: patient.idPatient }
      });
    })
      .then(programEnrollment => {
        if (!programEnrollment) {
          res.status(404).json({ error: 'Program Enrollment not found' });
          return Promise.reject('Program Enrollment not found'); // Stop the chain
        }
        console.log(programEnrollment);
        result.enrollmentCode = programEnrollment!.ProgramEnrollmentCode || '';
        result.enrollmentDate = programEnrollment.ProgramEnrollmentDate || null; //? new Date(programEnrollment.ProgramEnrollmentDate) : null;
        console.log('####', result.enrollmentDate, programEnrollment.ProgramEnrollmentDate)
        result.startDate = programEnrollment.ProgramStartDate ? new Date(programEnrollment.ProgramStartDate) : null;
        return Program.findByPk(programEnrollment.ProgramName);
      })
      .then(program => {
        if (!program) {
          res.status(404).json({ error: 'Program not found' });
          return Promise.reject('Program not found'); // Stop the chain
        }
        result.program = {
          name: program!.ProgramName,
          description: program!.ProgramDescription,
          duration: program!.ProgramDuration,
          numberExercices: 0
        }
        return ProgramExerciseSeries.findAll({
          where: { ProgramName: program.ProgramName }
        });
      })
      .then(programExerciseSeries => {
        const nbExercices = programExerciseSeries ? programExerciseSeries.length : 0;
        result.program.numberExercices = nbExercices;
        res.json(result);

      })
      .catch(error => {
        if (res.headersSent) return;
        console.error('Error fetching program details:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  }

  static setProgramStartDate(req: Request, res: Response): void {
    const userId = parseInt(req.body.userId);
    const today = new Date();

    console.log(userId)

    ProgramEnrollment.update(
      { ProgramStartDate: today.toString() },
      { where: { PatientId: userId } }
    )
      .then(([affectedRows]) => {
        if (affectedRows > 0) {
          res.json({ message: 'Program start date updated successfully.' });
        } else {
          res.status(404).json({ error: 'Program enrollment not found for the given user ID.' });
        }
      })
      .catch(err => {
        console.error('Error updating program start date:', err.message);
        res.status(500).json({ error: 'Internal server error' });
      });
  }
}


export default ProgramEnrollmentController;
