import { Schema, Document, model } from 'mongoose';
import { IStaffSchedule } from '../interfaces/staff_schedule.interface';


const staffScheduleSchema:Schema<IStaffSchedule> = new Schema(
  {
    staff_id: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
    day_of_week: { 
      type: String, 
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true 
    },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
  },
  { timestamps: true }
);

export const StaffSchedule = model<IStaffSchedule>('StaffSchedule', staffScheduleSchema);

