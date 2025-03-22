const express = require("express");

const router = express.Router();

const userController = require("../controller/UserController");

// Routes d'authentification

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

// 🔹 Ajout de la nouvelle route pour définir un mot de passe
router.post("/set-password", userController.setPassword);

export default router;