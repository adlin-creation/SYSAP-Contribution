import { Router } from "express";
import ReminderController from "../controllers/reminderController";

const router = Router();

router.post("/setReminder", ReminderController.setReminder);
router.get("/",ReminderController.getReminder)

export default router;