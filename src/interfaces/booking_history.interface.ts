import { Schema, model, Document } from "mongoose";
import { IAppointment } from "./appointment.interface";

export interface IBookingHistory extends Document {
  appointment_id: IAppointment['_id'];
  status: "pending" | "confirmed" | "completed" | "canceled";
  created_at: Date;
  updated_at: Date;
}
