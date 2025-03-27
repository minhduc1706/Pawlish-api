import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { AuthService } from "../services/auth.service";

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log('Request body:', req.body);
      const user = await AuthService.register(email, password);

      res.status(201).json({
        message: "User registered successfully!",
        user: { id: user._id, email },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { password, email } = req.body;
      const { accessToken, refreshToken, user } = await AuthService.login(
        email,
        password
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        accessToken,
        user: { _id: user._id, email: user.email, role: user.role },
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const cookies = req.cookies || {};
      const refreshTokenFromCookie = cookies.refreshToken;

      if (!refreshTokenFromCookie) {
        res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });
        throw new AppError("Refresh token is missing", 401);
      }

      const tokens = await AuthService.refreshToken(refreshTokenFromCookie);

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Token refreshed successfully",
        accessToken: tokens.accessToken,
      });
    } catch (error) {
      res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax" });
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 0,
      });
  
      res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
