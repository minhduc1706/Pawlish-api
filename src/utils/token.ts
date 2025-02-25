import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwtConfig";
import { RefreshToken } from "../models/refresh_token.model";

export const generateAccessToken = (user: {
  _id: string;
  email: string;
  role: string;
}): string => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    jwtConfig.accessTokenSecret,
    {
      expiresIn: "30m",
    }
  );
};

export const generateRefreshToken = async (user: {
  _id: string;
}): Promise<string> => {
  const token = jwt.sign({ id: user._id }, jwtConfig.refreshTokenSecret, {
    expiresIn: "7d",
  });

  const refreshToken = new RefreshToken({
    token,
    user_id: user._id,
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await refreshToken.save();

  return token;
};
