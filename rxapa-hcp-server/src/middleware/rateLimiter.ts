import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 tentatives
  message: {
    message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});