import { Schema, model } from "mongoose";
import { IAppointmentPayment } from "../interfaces/appointment_payment.interface";

const appointmentPaymentSchema: Schema<IAppointmentPayment> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointment_id: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    payment_method: { type: String, required: true },
    vnp_transaction_no: { type: String },
  },
  { timestamps: true }
);

export const AppointmentPayment = model<IAppointmentPayment>("AppointmentPayment", appointmentPaymentSchema);