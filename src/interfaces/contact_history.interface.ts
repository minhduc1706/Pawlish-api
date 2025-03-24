import { IStaff } from "./staff.interface";
import { IUser } from "./user.interface";

export interface IContactHistory {
    customer_id: IUser["_id"]
    date: string;
    type: "call" | "email" | "visit" | "message";
    notes?: string;
    staff_id?: IStaff["_id"]
    createdAt: string;
    updatedAt: string;
  } 