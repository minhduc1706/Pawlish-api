import { Schema, model } from "mongoose";
import { INotification } from "../interfaces/notification.interface";

const notificationSchema: Schema<INotification> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" }, 
    type: {
      type: String,
      enum: ["new_appointment", "cancelled_appointment", "rescheduled_appointment", "reminder", "system"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true }, 
    isRead: { type: Boolean, default: false },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: false }, 
  },
  { timestamps: true }
);

export const Notification = model<INotification>("Notification", notificationSchema);