import { Router } from "express";
import email from "../controllers/emailController";

const router = Router();

router.post("/", email.send);


export default router;