import * as crypto from "crypto";
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Générer un code unique de n caractères
export const generateCode = (length: number = 6): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(length); // Génère des octets aléatoires
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = bytes[i] % characters.length; // Assure que l'indice est dans la plage des caractères
    result += characters.charAt(randomIndex);
  }

  return result;
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
