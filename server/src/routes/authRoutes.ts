import { Router } from "express";
import AuthController from "../controllers/authController";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/change-program", AuthController.changeProgram);
router.get("/verify-token", AuthController.verifyToken);

export default router;

