import { Document } from "mongoose";
import { IService } from "./service.interface";
import { IStaff } from "./staff.interface";
import { IUser } from "./user.interface";

export interface IServiceReview extends Document {
  user_id: IUser["_id"]
  service_id: IService["_id"];
  staff_id: IStaff["_id"];
  rating: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}   