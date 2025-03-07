/* Routes de base pour l'inscription, la connexion et la déconnexion. */
import express from "express";
import * as userController from "../controller/UserController"; 
import  isAuth from "../middleware/isAuth"; 

const router = express.Router();

// Inscription d'un utilisateur
router.post("/signup", userController.signup);

// Connexion d'un utilisateur et génération d'un token JWT
router.post("/login", userController.login);

// Déconnexion protégée par authentification
router.post("/logout", isAuth, userController.logout);

export default router;
