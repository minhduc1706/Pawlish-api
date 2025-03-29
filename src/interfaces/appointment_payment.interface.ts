import { IUser } from "./user.interface";
import { IAppointment } from "./appointment.interface";

export interface IAppointmentPayment {
    user_id: IUser["_id"];
    appointment_id: IAppointment["_id"];
    amount: number;
    status: "pending" | "completed" | "failed";
    payment_method: string;
    vnp_transaction_no?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }