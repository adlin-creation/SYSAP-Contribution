import express from "express";
import { loginLimiter } from "../middleware/rateLimiter"; // Ajout
import csrf from "csurf";
import { validateResetToken } from "../middleware/validateResetToken";

const router = express.Router();
const userController = require("../controller/UserController");

// Middleware CSRF
const csrfProtection = csrf({ cookie: true });

router.post("/signup", userController.signup);
router.post("/login", loginLimiter, userController.login); // ROUTE LOGIN (PUBLIC) + BRUTE FORCE 
router.post("/logout", userController.logout);

// CSRF TOKEN ENDPOINT 
router.get("/csrf-token", csrfProtection, (req, res) => {
    return res.json({ csrfToken: req.csrfToken() }); // on renvoie le token CSRF
  });

// routes pour le reset de mot de passe
router.post("/set-password", userController.resetPasswordRequest);
router.post("/reset-password", validateResetToken, userController.resetPassword);


// 🔹 Ajout de la nouvelle route pour définir un mot de passe
//router.post("/set-password", userController.setPassword);


export default router;