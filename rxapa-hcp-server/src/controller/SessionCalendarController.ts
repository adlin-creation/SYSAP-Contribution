import { Request, Response } from "express";
import { Session } from "../model/Session";
import { Patient } from "../model/Patient";
import { Program } from "../model/Program";
import { CalendarSession } from "../model/CalendarSession";

/**
 * Créer un rendez-vous de session pour le calendrier
 */
exports.createCalendarSession = async (req: Request, res: Response) => {
  const { name, startDate, endDate, patientId, programId } = req.body;

  try {
    // Vérifier que le patient existe
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient introuvable" });
    }

    // Vérifier que le programme existe
    const program = await Program.findByPk(programId);
    if (!program) {
      return res.status(404).json({ message: "Programme introuvable" });
    }

    // Créer la session
    const newSession = await CalendarSession.create({
      name,
      startDate,
      endDate,
      PatientId: patientId,
      ProgramId: programId,
    });

    return res.status(201).json(newSession);
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
  
};
/**
 * Récupérer tous les rendez-vous liés à un programme
 */
exports.getSessionsByProgram = async (req: Request, res: Response) => {
    const programId = req.params.id;
  
    try {
      const sessions = await CalendarSession.findAll({
        where: { ProgramId: programId },
      });
  
      res.status(200).json(sessions);
    } catch (error) {
      console.error("Erreur récupération des rendez-vous :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
/**
 * Modifier un rendez-vous de session
 */
exports.updateCalendarSession = async (req: Request, res: Response) => {
    const { id } = req.params; // Récupérer l'ID de la session à modifier
    const { name, startDate, endDate, patientId, programId } = req.body;
  
    try {
      // Vérifier que la session existe
      const session = await CalendarSession.findByPk(id);
      if (!session) {
        return res.status(404).json({ message: "Rendez-vous introuvable" });
      }
  
      // Vérifier que le patient existe
      const patient = await Patient.findByPk(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient introuvable" });
      }
  
      // Vérifier que le programme existe
      const program = await Program.findByPk(programId);
      if (!program) {
        return res.status(404).json({ message: "Programme introuvable" });
      }
  
      // Mise à jour des données de la session
      session.name = name || session.name;
      session.startDate = startDate || session.startDate;
      session.endDate = endDate || session.endDate;
      session.PatientId = patientId || session.PatientId;
      session.ProgramId = programId || session.ProgramId;
  
      // Sauvegarder les changements dans la base de données
      await session.save();
  
      return res.status(200).json(session); // Retourner la session mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rendez-vous :", error);
      return res.status(500).json({ message: "Erreur interne du serveur" });
    }
  };
/**
 * Supprimer un rendez-vous de session
 */
exports.deleteCalendarSession = async (req: Request, res: Response) => {
    const { id } = req.params; // Récupérer l'ID de la session à supprimer
  
    try {
      // Vérifier que la session existe
      const session = await CalendarSession.findByPk(id);
      if (!session) {
        return res.status(404).json({ message: "Rendez-vous introuvable" });
      }
  
      // Supprimer la session
      await session.destroy();
  
      return res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la suppression du rendez-vous :", error);
      return res.status(500).json({ message: "Erreur interne du serveur" });
    }
  };
    