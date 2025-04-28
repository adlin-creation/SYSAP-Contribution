import express from "express";
const router = express.Router();
const sessionCalendarController = require("../controller/SessionCalendarController");

// Créer une session
router.post("/", sessionCalendarController.createCalendarSession);

// Récupérer toutes les sessions d'un programme
router.get("/by-program/:id", sessionCalendarController.getSessionsByProgram);

// Modifier un rendez-vous de session
router.put("/:id", sessionCalendarController.updateCalendarSession); // S'assurer que l'ID est passé correctement

// Supprimer un rendez-vous de session
router.delete("/:id", sessionCalendarController.deleteCalendarSession); // Supprimer selon l'ID

module.exports = router;
