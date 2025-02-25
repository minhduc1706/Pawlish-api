import { Document, model, Schema } from "mongoose";
import { IUser } from "./user.interface";

export interface IRefreshToken extends Document {
  token: string;
  user_id: IUser["_id"];
  expiresAt: Date;
  issuedAt: Date;
}
