import { IUser } from "./user.interface";

export interface IReport {
    _id: string;
    user_id: IUser["_id"]
    type: "weekly" | "monthly";
    status: "pending" | "approved" | "rejected";
    period: string;
    date: Date;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }