import { Document } from "mongoose";
import { IService } from "./service.interface";
import { IUser } from "./user.interface";

export interface IStaff extends Document {
  user_id: IUser["_id"];
  full_name: string;
  email: string;
  phone?: string;
  salary: number;
  service_id: IService["_id"][];
  createdAt?: Date;
  updatedAt?: Date;
}
