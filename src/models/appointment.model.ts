import { Schema, model } from "mongoose";
import { IAppointment } from "../interfaces/appointment.interface";

const appointmentSchema: Schema<IAppointment> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pet_id: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
    service_id: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    staff_id: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    appointment_date: { type: Date, required: true },
    appointment_time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "canceled"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Appointment = model<IAppointment>(
  "Appointment",
  appointmentSchema
);
