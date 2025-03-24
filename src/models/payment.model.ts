  import { Schema, model } from "mongoose";
  import { IPayment } from "../interfaces/payment.interface";

  const paymentSchema: Schema<IPayment> = new Schema(
    {
      user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
      amount: { type: Number, required: true, min: 0 },
      type: {
        type: String,
        enum: ["salary", "commission", "bonus"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "rejected"],
        default: "pending",
      },
      date: { type: Date, required: true }, 
      period: { type: String, required: true }, 
    },
    { timestamps: true }
  );

  export const Payment = model<IPayment>("Payment", paymentSchema);