import * as crypto from 'crypto';
import nodemailer from 'nodemailer';

// Générer un code unique de n caractères
export const generateCode = (length: number = 6): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = crypto.randomBytes(length); // Génère des octets aléatoires
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = bytes[i] % characters.length; // Assure que l'indice est dans la plage des caractères
        result += characters.charAt(randomIndex);
    }

    return result;
};
export const sendEmail = async (recipient: string, code: string): Promise<void> => {

    // Configuration de Mailtrap avec les paramètres SMTP
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io', // Serveur SMTP de Mailtrap
        port: 587,                // Port à utiliser pour l'envoi
        auth: {
            user: 'd00b24de30c6fd', // Ton utilisateur Mailtrap (trouvé dans ton inbox Mailtrap)
            pass: 'd4712dc7c72ec3'  // Ton mot de passe Mailtrap (trouvé dans ton inbox Mailtrap)
        }
    });

    // Configurer l'e-mail que tu veux envoyer
    const mailOptions = {
        from: 'info@mailtrap.io',  // L'adresse e-mail d'envoi
        to: 'djmail.info13@gmail.com', // L'adresse e-mail du destinataire
        subject: 'Test Email',
        text: 'Ceci est un test envoyé via Mailtrap !'
    };

    // Envoi de l'e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erreur lors de l\'envoi de l\'email:', error);
        } else {
            console.log('E-mail envoyé : ' + info.response);
        }
    });
};

import jwt, { JwtPayload } from 'jsonwebtoken';
import { getMaxListeners } from 'events';


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
        console.error('Erreur lors de la vérification du token:', error);
        return null;
    }
};