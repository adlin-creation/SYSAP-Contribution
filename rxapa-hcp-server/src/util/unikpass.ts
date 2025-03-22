import * as crypto from "crypto";
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

console.log("✅ Environnement chargé avec dotenv:", process.env ? "OK" : "❌ ERREUR");

export const generateCode = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code; // 🔹 Assure-toi qu'on retourne bien une valeur
};


const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = (
  to: string,
  subject: string,
  text: string
): Promise<void> => {
  const mailOptions: SendMailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
  };

  return transporter
    .sendMail(mailOptions)
    .then(() => {
      console.log("Code d'accès envoyé avec succès");
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi du code d'accès", error);
    });
};

// Fonction pour hacher une valeur (code d'accès ou mot de passe)
export const hashValue = async (value: string): Promise<string> => {
  return await bcrypt.hash(value, 10);
};

// Fonction pour vérifier une valeur hachée
export const verifyHash = async (value: string, hashedValue: string): Promise<boolean> => {
  return await bcrypt.compare(value, hashedValue);
};

export { sendEmail };

import jwt, { JwtPayload } from "jsonwebtoken";
import { getMaxListeners } from "events";

export const extractEmailFromToken = (tokenSender: string): string | null => {
  try {
    const decoded = jwt.verify(tokenSender, process.env.TOKEN_SECRET_KEY || "");

    // Vérifier que decoded est un objet et qu'il contient "email"
    if (typeof decoded === "string" || !("email" in decoded)) {
      console.error("Format du token invalide");
      return null;
    }

    return decoded.email as string;
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    return null;
  }
};
