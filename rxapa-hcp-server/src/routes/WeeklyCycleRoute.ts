import express from "express";
import isAuth from "../util/isAuth";

const router = express.Router();

const cycleController = require("../controller/WeeklyCycleController");

router.post("/create-cycle", isAuth, cycleController.createCycle);

router.post("/:cycleKey/add-session", isAuth, cycleController.addSession);

router.get("/cycle/:cycleKey", isAuth, cycleController.getCycle);

router.get("/cycles", isAuth, cycleController.getCycles);

router.get("/:cycleKey/sessions", isAuth, cycleController.getSessions);

router.put("/update-cycle/:cycleKey", isAuth, cycleController.updateCycle);

router.delete("/delete-cycle/:cycleKey", isAuth, cycleController.deleteCycle);

router.put(
  "/:cycleKey/setIsSessionsFlexible",
  isAuth,
  cycleController.setIsSessionFlexible
);
export default router;
