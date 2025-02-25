import express from "express";
import { registerValidation } from "../validations/registerValidation";
import { handleValidationErrors } from "../errors/handleValidationErrors";
import { loginValidation } from "../validations/loginValidation";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();
const authController = new AuthController();
const { login, refreshToken, register } = authController;

router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  register.bind(authController)
);

router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  login.bind(authController)
);

router.post("/refresh-token", refreshToken.bind(authController));

export default router;
