import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwtConfig";
import { AppError } from "../errors/AppError";

export const authorized = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(new AppError("Authentication token is missing", 401));
    }

    try {
      const decoded = jwt.verify(token, jwtConfig.accessTokenSecret) as {
        id: string;
        role: string;
      };

      if (!allowedRoles.includes(decoded.role)) {
        return next(
          new AppError("You do not have permission to access this route", 403)
        );
      }

      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("Token expired", 401));
      }
      return next(new AppError("Invalid token", 401));
    }
  };
};
