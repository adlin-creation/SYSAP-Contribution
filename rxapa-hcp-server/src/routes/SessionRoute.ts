import express from "express";
import isAuth from "../util/isAuth";

const router = express.Router();

const sessionController = require("../controller/SessionController");

router.post("/create-session", isAuth, sessionController.createSession);

router.post("/:sessionKey/add-bloc", isAuth, sessionController.addBloc);

router.get("/session/:sessionKey", isAuth, sessionController.getSession);

router.get("/sessions", isAuth, sessionController.getSessions);

router.put(
  "/update-session/:sessionKey",
  isAuth,
  sessionController.updateSession
);

router.delete(
  "/delete-session/:sessionKey",
  isAuth,
  sessionController.deleteSession
);

export default router;
