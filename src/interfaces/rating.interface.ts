import { Document } from "mongoose";
import { IStaff } from "./staff.interface";
import { IService } from "./service.interface";
import { IUser } from "./user.interface";

export interface IRating extends Document {
  staffId: IStaff["_id"];
  serviceId: IService["_id"];
  customerId: IUser["_id"];
  staffRatings: {
    overall: number;
    attitude: number;
    professionalism: number;
    communication: number;
    timeliness: number;
  };
  serviceRatings: {
    overall: number;
    quality: number;
    satisfaction: number;
    timeliness: number;
    value: number;
  };
  createdAt: Date;
  updatedAt: Date;
}