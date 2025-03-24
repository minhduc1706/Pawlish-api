import { Schema, model } from "mongoose";
import { IStaffSchedule } from "../interfaces/staff_schedule.interface";

const staffScheduleSchema: Schema<IStaffSchedule> = new Schema(
  {
    staff_id: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    service_id: { type: Schema.Types.ObjectId, ref: "Service", required: true }, 
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const StaffSchedule = model<IStaffSchedule>("StaffSchedule", staffScheduleSchema);