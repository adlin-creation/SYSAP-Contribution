import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Bypass le certificat auto-signé 
  },
});

export const sendResetEmail = async (to: string, resetLink: string) => {
  try {
    await transporter.sendMail({
      from: `"RxAPA" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Réinitialisation de mot de passe",
      html: `
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez ici pour le réinitialiser : <a href="${resetLink}">${resetLink}</a></p>
        <p>Ce lien expire dans 15 minutes.</p>
      `,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du mail :", error);
    // Ne jette pas l’erreur pour ne pas faire planter le serveur
  }
};