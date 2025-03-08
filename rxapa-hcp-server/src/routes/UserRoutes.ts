import express from "express";
const router = express.Router();
const userController = require("../controller/UserController");

router.post("/signup", userController.signup);

// Connexion
router.post("/login", userController.login);

// Déconnexion
router.post("/logout", userController.logout);

export default router;
