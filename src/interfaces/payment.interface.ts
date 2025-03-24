import { Document } from "mongoose";
import { IUser } from "./user.interface";

export interface IPayment extends Document{
  _id: string;
  user_id: IUser["_id"]
  amount: number;
  type: "salary" | "commission" | "bonus";
  status: "pending" | "completed" | "rejected";
  date: Date;
  period: string;
  createdAt: Date;
  updatedAt: Date;
}