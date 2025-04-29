import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
<<<<<<< HEAD
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  
=======
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
  tls: {
    rejectUnauthorized: false, // Bypass le certificat auto-signé 
  },
});
<<<<<<< HEAD
console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS?.slice(0, 5) + "****");
=======
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68

export const sendResetEmail = async (to: string, resetLink: string) => {
  try {
    await transporter.sendMail({
<<<<<<< HEAD
      from: `"RxAPA" <${process.env.MAIL_USER}>`,       to,
=======
      from: `"RxAPA" <${process.env.EMAIL_USER}>`,
      to,
>>>>>>> 14cb596907bdb9208979898040b04da5a64dcc68
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