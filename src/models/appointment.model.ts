import { Schema, model } from "mongoose";
import { IAppointment } from "../interfaces/appointment.interface";

const appointmentSchema: Schema<IAppointment> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    pet_id: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
    service_id: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    amount:{type: Number, required: true},
    status: {
      type: String,
      enum: ["pending", "confirmed", "ongoing", "completed", "cancelled"],
      default: "pending",
    },
    staff_id: { type: Schema.Types.ObjectId, ref: "Staff" },
    notes: { type: String },
    actualStartTime: { type: Date, default: null},
  },
  { timestamps: true }
);

export const Appointment = model<IAppointment>(
  "Appointment",
  appointmentSchema
);
