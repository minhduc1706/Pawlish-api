import { Document } from "mongoose";
import { IPet } from "./pet.interface";
import { IStaff } from "./staff.interface";
import { IService } from "./service.interface";
import { IUser } from "./user.interface";

export interface IAppointment extends Document {
  user_id: IUser["_id"];
  pet_id: IPet["_id"];
  service_id: IService["_id"];
  staff_id: IStaff["_id"];
  appointment_date: Date;
  appointment_time: string;
  status: "pending" | "confirmed" | "completed" | "canceled";
  notes: string;
  created_at: Date;
  updated_at: Date;
}
