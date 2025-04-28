import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path from "path";

// Définir le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, "images/"); //Dossier où enregistrer les images
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    cb(null, Date.now() + path.extname(file.originalname)); //Nom unique
  },
});

// Filtrer les fichiers acceptés (uniquement images)
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accepter le fichier
    } else {
      cb(new Error("Seules les images sont autorisées"));
    }
  };

// Middleware Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, //Limite à 5 Mo
  fileFilter: fileFilter,
});

export default upload;
