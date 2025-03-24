import { Document, Types } from "mongoose";

export interface ITransaction extends Document {
 _id: Types.ObjectId;
  amount: number;
  status: "pending" | "completed" | "failed";
  gateway: "stripe" | "paypal" | "cash";
  transaction_code: string;
  createdAt?: Date;
  updatedAt?: Date;
}