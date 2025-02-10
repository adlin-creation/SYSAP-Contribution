import express from "express";

const router = express.Router();

const authController = require("../controller/Auth");

router.get("/login", authController.login);

router.post("/logout", authController.logout);

export default router;
