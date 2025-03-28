import { Document } from "mongoose";
import { IPet } from "./pet.interface";
import { IStaff } from "./staff.interface";
import { IService } from "./service.interface";
import { IUser } from "./user.interface";
export interface IAppointment extends Document {
  user_id: IUser["_id"];
  pet_id: IPet["_id"];
  service_id: IService["_id"];
  date: Date;
  time: string;
  amount: number;
  status: "pending" | "confirmed" | "ongoing" | "completed" | "cancelled";
  staff_id?: IStaff["_id"];
  notes?: string;
  actualStartTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}
