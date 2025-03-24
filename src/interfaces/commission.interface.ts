import { Document } from "mongoose";
import { IStaff } from "./staff.interface";

export interface ICommission extends Document {
  staff_id: IStaff["_id"];
  amount: number; 
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}