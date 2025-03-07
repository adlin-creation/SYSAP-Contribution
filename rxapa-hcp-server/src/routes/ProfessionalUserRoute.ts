// Routes CRUD pour gérer les professionnels. On utilise isAuth([]) pour restreindre
// l'accès selon le rôle. (Exemple: seul superadmin peut créer un user pro.)

import express from "express";
import isAuth from "../middleware/isAuth";

const router = express.Router();
const professionalUserController = require("../controller/ProfessionalUserController");

// Seul superadmin peut créer un professionnel
router.post(
  "/create-professional-user",
  isAuth(["superadmin"]),
  professionalUserController.createProfessionalUser
);

// Seul superadmin peut mettre à jour
router.put(
  "/update-professional-user/:id",
  isAuth(["superadmin"]),
  professionalUserController.updateProfessionalUser
);

// Seul superadmin peut supprimer
router.delete(
  "/delete-professional-user/:id",
  isAuth(["superadmin"]),
  professionalUserController.deleteProfessionalUser
);

// superadmin, admin, doctor, kinesiologist peuvent récupérer un pro par ID
router.get(
  "/professional-user/:id",
  isAuth(["superadmin", "admin", "doctor", "kinesiologist"]),
  professionalUserController.getProfessionalUser
);

// superadmin, admin peuvent voir la liste
router.get(
  "/professional-users",
  isAuth(["superadmin", "admin"]),
  professionalUserController.getProfessionalUsers
);

// superadmin, admin, kinesiologist => voir patients d'un kinésiologue
router.get(
  "/kinesiologist-patients/:id",
  isAuth(["superadmin", "admin", "kinesiologist"]),
  professionalUserController.getKinesiologistPatients
);

// superadmin, admin, doctor => voir patients d'un médecin
router.get(
  "/doctor-patients/:id",
  isAuth(["superadmin", "admin", "doctor"]),
  professionalUserController.getDoctorPatients
);

// superadmin => générer un mot de passe
router.get(
  "/generate-password",
  isAuth(["superadmin"]),
  professionalUserController.generatePassword
);

export default router;