import { Types } from "mongoose";
import { IPayment } from "../interfaces/payment.interface";
import { Payment } from "../models/payment.model";

export class PaymentService {
  static async createPayment(paymentData: Partial<IPayment>): Promise<IPayment> {
    const newPayment = new Payment(paymentData);
    return await newPayment.save();
  }

  static async getCustomerPayments(userId: string): Promise<IPayment[]> {
    return await Payment.find({ user_id: userId }).populate("user_id", "full_name email");
  }

  static async getAllPayments(filters: {
    date?: string;
    userId?: string;
    status?: string;
  }): Promise<IPayment[]> {
    const query: any = {};
    if (filters.date) {
      const startOfDay = new Date(filters.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.date);
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    if (filters.userId) query.user_id = new Types.ObjectId(filters.userId);
    if (filters.status) query.status = filters.status;

    return await Payment.find(query).populate("user_id", "full_name email");
  }

  static async updatePayment(id: string, updateData: Partial<IPayment>): Promise<IPayment | null> {
    return await Payment.findByIdAndUpdate(id, updateData, { new: true });
  }
}