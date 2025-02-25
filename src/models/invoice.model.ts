import { IInvoice } from "../interfaces/invoice.interface";
import { model, Schema } from "mongoose";

const InvoiceSchema: Schema<IInvoice> = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  paymentMethod: {
    type: String,
    enum: ["momo", "vnpay", "cash"],
    required: true,
  },
  details: [
    {
      description: { type: String, required: true },
      serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    },
  ],
});

export default model<IInvoice>("Invoice", InvoiceSchema);
