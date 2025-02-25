import { model, Schema } from "mongoose";
import { IRefreshToken } from "../interfaces/refresh_token.interface";

const RefreshTokenSchema: Schema<IRefreshToken> = new Schema({
  token: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true },
  issuedAt: { type: Date, default: Date.now },
});

export const RefreshToken = model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);
