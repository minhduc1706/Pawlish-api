import { Schema, model, Document } from "mongoose";
import { ITransaction } from "../interfaces/transaction.interface";

const transactionSchema: Schema<ITransaction> = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: "Payment", required: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    gateway: {
      type: String,
      enum: ["stripe", "paypal", "cash"],
      required: true,
    },
    transaction_code: { type: String, required: true },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
