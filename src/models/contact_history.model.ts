import { model, Schema } from "mongoose";
import { IContactHistory } from "../interfaces/contact_history.interface";

const contactHistorySchema = new Schema<IContactHistory>(
  {
    customer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    type: {
      type: String,
      enum: ["call", "email", "visit", "message"],
      required: true,
    },
    notes: { type: String },
    staff_id: { type: Schema.Types.ObjectId, ref: "Staff" },
  },
  { timestamps: true }
);

export const ContactHistory = model("ContactHistory", contactHistorySchema);
