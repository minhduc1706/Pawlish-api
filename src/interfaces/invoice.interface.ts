import { IUser } from "./user.interface";

export interface IInvoice {
    user_id: IUser['_id'];
    amount: number;
    status: "pending" | "paid" | "failed";
    createdAt: Date;
    paymentMethod: "momo" | "vnpay" | "cash";
    details: {
      description: string;
      serviceId: string;
    }[];
  }