import { Schema, Document, model } from 'mongoose';
import { IStaff } from './staff.interface';
import { IService } from './service.interface';

export interface IStaffSchedule extends Document {
  staff_id: IStaff['_id']
  service_id: IService["_id"]
  time: string;
  duration: number;
  isBooked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
