import { jwtConfig } from "../config/jwtConfig";
import { AppError } from "../errors/AppError";
import { IUser } from "../interfaces/user.interface";
import { RefreshToken } from "../models/refresh_token.model";
import { User } from "../models/user.model";
import { comparePasswords, hashPassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import jwt from "jsonwebtoken";

export class AuthService {
  static async register(email: string, password: string): Promise<IUser> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already exists", 400);
    }
    
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      password: hashedPassword,
      role: "customer",
      status: "active",
      device: [],
    });

    return newUser.save();
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new AppError("Invalid email", 401);
    if (!(await comparePasswords(password, user.password))) {
      throw new AppError("Invalid password", 401);
    }
    
    if (user.devices.length >= 3) {
      throw new AppError("Too many devices logged in. Log out from another device first.", 403);
    }
    
    const accessToken = generateAccessToken({ _id: user._id.toString(), email: user.email, role: user.role });
    const refreshToken = await generateRefreshToken({ _id: user._id.toString() });

    const refreshTokenModel = new RefreshToken({
      token: refreshToken,
      user_id: user._id,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await refreshTokenModel.save();

    return { accessToken, refreshToken, user };
  }

  static async refreshToken(userRefreshToken: string) {
    const existingToken = await RefreshToken.findOne({ token: userRefreshToken });
    if (!existingToken) throw new AppError("Invalid refresh token", 403);

    if (new Date() > existingToken.expiresAt) {
      await RefreshToken.deleteOne({ token: userRefreshToken });
      throw new AppError("Token expired", 401);
    }

    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - existingToken.issuedAt.getTime() > THIRTY_DAYS) {
      await RefreshToken.deleteOne({ token: userRefreshToken });
      throw new AppError("Session expired. Please login again.", 401);
    }
    
    try {
      const payload = jwt.verify(userRefreshToken, jwtConfig.refreshTokenSecret) as {id:string}
      console.log("test payload ", payload)
      const user = await User.findById(payload.id);
      if (!user || user.status !== "active") {
        await RefreshToken.deleteOne({ token: userRefreshToken });
        throw new AppError("User not found or inactive", 403);
      }
      
      await RefreshToken.deleteOne({ token: userRefreshToken });
      
      const newAccessToken = generateAccessToken({ _id: payload.id, email: user.email, role: user.role });
      const newRefreshToken = await generateRefreshToken({ _id: payload.id });
      
      const newRefreshTokenModel = new RefreshToken({
        token: newRefreshToken,
        user_id: payload.id,
        issuedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      
      await newRefreshTokenModel.save();
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error("JWT Verification Error:", error);
      await RefreshToken.deleteOne({ token: userRefreshToken });
      throw new AppError("Invalid or expired refresh token", 403);
    }
  }
}
