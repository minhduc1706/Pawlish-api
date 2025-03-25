import { Document } from "mongoose";
import { IUser } from "./user.interface";
import { IOrder } from "./order.interface";
import { ITransaction } from "./transaction.interface";

export interface IOrderPayment extends Document {
  user_id: IUser["_id"];
  order_id: IOrder["_id"];
  amount: number;
  status: "pending" | "completed" | "failed";
  payment_method: string;
  transaction_id?: ITransaction["_id"];
  created_at: Date;
  vnp_transaction_no:string;
}