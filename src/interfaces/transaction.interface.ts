import { Types } from "mongoose";

export interface ITransaction {
  _id:Types.ObjectId;
  vnp_transaction_no: string;
  amount: number;
  bank_code?: string;
  card_type?: string;
  pay_date?: Date;
  status: "completed" | "failed";
}
