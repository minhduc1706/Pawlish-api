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

    if (!user) {
      throw new AppError("Invalid email", 401);
    }

    const isPasswordCorrect = await comparePasswords(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = generateAccessToken({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = await generateRefreshToken({
      _id: user._id.toString(),
    });

    return { accessToken, refreshToken, user };
  }

  static async refreshToken(userRefreshToken: string) {
    const existingToken = await RefreshToken.findOne({
      token: userRefreshToken,
    });
    if (!existingToken) {
      throw new AppError("Invalid refresh token", 403);
    }

    if (new Date() > existingToken.expiresAt) {
      await RefreshToken.deleteOne({ token: userRefreshToken });
      throw new AppError("Token expired", 401);
    }

    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - existingToken.issuedAt.getTime() > THIRTY_DAYS) {
      await RefreshToken.deleteOne({ token: userRefreshToken });
      throw new AppError("Session expired. Please login again.", 401);
    }

    let payload: { _id: string; email: string; role: string };
    try {
      payload = jwt.verify(userRefreshToken, jwtConfig.refreshTokenSecret) as {
        _id: string;
        email: string;
        role: string;
      };
    } catch (error) {
      await RefreshToken.deleteOne({ token: userRefreshToken });
      throw new AppError("Invalid or expired refresh token", 403);
    }

    await RefreshToken.findOneAndDelete({ token: userRefreshToken });

    const accessToken = generateAccessToken({
      _id: payload._id,
      email: payload.email,
      role: payload.role,
    });

    const refreshToken = generateRefreshToken({ _id: payload._id });

    const newRefreshTokenModel = new RefreshToken({
      token: refreshToken,
      user_id: payload._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await newRefreshTokenModel.save();
    return { accessToken, refreshToken };
  }
}
