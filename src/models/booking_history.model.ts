import { Schema, model } from "mongoose";
import { IBookingHistory } from "../interfaces/booking_history.interface";

const bookingHistorySchema: Schema<IBookingHistory> = new Schema(
  {
    appointment_id: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "canceled"],
      required: true,
    },
  },
  { timestamps: true }
);

export const BookingHistory = model("BookingHistory", bookingHistorySchema);
