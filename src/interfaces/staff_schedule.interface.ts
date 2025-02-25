import { Schema, Document, model } from 'mongoose';
import { IStaff } from './staff.interface';

export interface IStaffSchedule extends Document {
  staff_id: IStaff['_id']
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string; 
  end_time: string;
  createdAt?: Date;
  updatedAt?: Date;
}
