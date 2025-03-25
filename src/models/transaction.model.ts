import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    vnp_transaction_no: { type: String, required: true }, 
    amount: { type: Number, required: true }, 
    bank_code: { type: String }, 
    card_type: { type: String }, 
    pay_date: { type: Date },
    status: { 
      type: String, 
      enum: ["completed", "failed"], 
      default: "completed" 
    },
  },
  { timestamps: true }
);

export const Transaction = model("Transaction", transactionSchema);