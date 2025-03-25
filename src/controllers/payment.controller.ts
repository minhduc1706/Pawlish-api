import { Request, Response, NextFunction } from "express";
import { PaymentService } from "../services/payment.service";
import { Types } from "mongoose";

export class PaymentController {
  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const paymentData = { ...req.body, user_id: userId };
      const newPayment = await PaymentService.createPayment(paymentData);
      res.status(201).json(newPayment);
    } catch (error) {
      next(error);
    }
  }

  async getCustomerPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const payments = await PaymentService.getCustomerPayments(userId);
      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  }

  async getAllPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, userId, status } = req.query;
      const payments = await PaymentService.getAllPayments({
        date: date as string,
        userId: userId as string,
        status: status as string,
      });
      res.status(200).json(payments);
    } catch (error) {
      next(error);
    }
  }

  async updatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedPayment = await PaymentService.updatePayment(
        req.params.id,
        req.body
      );
      if (!updatedPayment) {
        return res.status(404).json({ message: "Không tìm thấy thanh toán" });
      }
      res.status(200).json(updatedPayment);
    } catch (error) {
      next(error);
    }
  }
}
