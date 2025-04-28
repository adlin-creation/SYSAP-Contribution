import readline from "readline";
import { Professional_User } from "../model/Professional_User";
import bcrypt from "bcrypt";
import { sequelize } from "../util/database";

async function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

async function createSuperAdmin() {
  await sequelize.authenticate();
  await sequelize.sync();

  const email = await ask("Email du superadmin: ");
  const password = await ask("Mot de passe du superadmin: ");

  const existing = await Professional_User.findOne({ where: { email } });
  if (existing) {
    console.log("❌ Un utilisateur avec cet email existe déjà.");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await Professional_User.create({
    firstname: "Super",
    lastname: "Admin",
    email,
    phoneNumber: "0000000000",
    role: "superadmin",
    password: hashedPassword,
    active: true,
  });

  console.log("✅ Superadmin créé avec succès.");
  process.exit(0);
}

createSuperAdmin().catch((err) => {
  console.error("❌ Erreur:", err);
  process.exit(1);
});
