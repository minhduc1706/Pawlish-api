import { Types } from "mongoose";
import { IUser } from "./user.interface";
import { IAppointment } from "./appointment.interface";

export interface INotification {
  _id: Types.ObjectId;
  user_id?: IUser["_id"]
  type: "new_appointment" | "cancelled_appointment" | "rescheduled_appointment" | "reminder" | "system";
  title: string;
  message: string;
  isRead: boolean;
  appointmentId?: IAppointment["_id"];
  createdAt: Date;
  updatedAt: Date;
}
