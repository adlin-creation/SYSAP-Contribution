import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 3, // 3 tentatives
  message: {
    message: "Trop de tentatives de connexion. Réessayez dans 1 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});