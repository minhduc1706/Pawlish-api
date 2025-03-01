import express from "express";
import { registerValidation } from "../validations/registerValidation";
import { handleValidationErrors } from "../errors/handleValidationErrors";
import { loginValidation } from "../validations/loginValidation";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();
const authController = new AuthController();
const { login, refreshToken, register,logout } = authController;

router.post("/register", registerValidation, handleValidationErrors, register);
router.post("/login", loginValidation, handleValidationErrors, login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout)
export default router;
