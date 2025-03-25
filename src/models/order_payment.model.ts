import { Schema, model } from "mongoose";
import { IOrderPayment } from "../interfaces/order_payment.interface";

const orderPaymentSchema: Schema<IOrderPayment> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    payment_method: { type: String, required: true },
    transaction_id: { type: Schema.Types.ObjectId, ref: "Transaction" },
    created_at: { type: Date, default: Date.now },
    vnp_transaction_no:{ type: String, required: false },
  },
  { timestamps: true }
);

export const OrderPayment = model<IOrderPayment>("OrderPayment", orderPaymentSchema);