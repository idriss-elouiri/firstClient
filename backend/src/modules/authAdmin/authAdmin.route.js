import express from "express";
import * as authController from "./authAdmin.controller.js";
import { registerShcema, loginShcema } from "./authAdmin.shcema.js";
import { validateZod } from "../../middlewares/validate-zod.js";

const router = express.Router();

router.post(
  "/register",
  validateZod(registerShcema),
  authController.registerHandler
);
router.post("/login", validateZod(loginShcema), authController.loginHandler);
router.post("/google", authController.googleHandler);


export default router;