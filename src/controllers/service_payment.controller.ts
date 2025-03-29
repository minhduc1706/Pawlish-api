import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { Appointment } from "../models/appointment.model";
import { ServicePaymentService } from "../services/service_payment.service";

dotenv.config();
const FRONTEND_URL = process.env.FRONTEND_URL!;

export class ServicePaymentController {
  async createVNPayPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, service, staff, date, time, pet, user, notes } = req.body;
      const userId = req.user?.id;
        console.log("first", req.body)
      if (!amount || !service || !staff || !date || !time || !pet || !user || user !== userId) {
        return res.status(400).json({ message: "Thiếu hoặc thông tin không hợp lệ" });
      }

      const newAppointment = await Appointment.create({
        user_id: userId,
        pet_id: pet,
        service_id: service,
        date: new Date(date),
        time,
        amount,
        status: "pending",
        staff_id: staff,
        notes: notes || "",
      });
      console.log("New appointment created:", newAppointment);

      const ipAddr = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";

      const paymentUrl = await ServicePaymentService.createVNPayPaymentUrl({
        amount,
        appointmentId: newAppointment._id.toString(),
        userId,
        ipAddr,
      });

      res.status(200).json({ paymentUrl });
    } catch (error) {
      next(error);
    }
  }

  async handleVNPayReturn(req: Request, res: Response, next: NextFunction) {
    try {
      const vnpParams = req.query as { [key: string]: string };
      console.log("VNPAY Return Params:", vnpParams);

      const result = await ServicePaymentService.verifyVNPayReturn(vnpParams);
      const appointmentId = vnpParams["vnp_TxnRef"];

      if (result.isValid && result.responseCode === "00") {
        await Appointment.findByIdAndUpdate(appointmentId, { status: "confirmed" });
        res.redirect(`${FRONTEND_URL}/payment-result?type=appointment&success=true&id=${appointmentId}`);
      } else {
        res.redirect(`${FRONTEND_URL}/payment-result?type=appointment&success=false&id=${appointmentId}`);
      }
    } catch (error) {
      console.error("Error handling VNPay return:", error);
      res.redirect(`${FRONTEND_URL}/booking?success=false`);
    }
  }
}