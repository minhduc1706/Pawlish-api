import { Request, Response, NextFunction } from "express";
import { OrderPaymentService } from "../services/order_payment.service";
import { Order } from "../models/order.model";

export class OrderPaymentController {
  async createVNPayPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, products } = req.body;
      const userId = req.user?.id;

      if (
        !amount ||
        !userId ||
        !products ||
        !Array.isArray(products) ||
        products.length === 0
      ) {
        return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
      }

      const ipAddr =
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        "127.0.0.1";

      const newOrder = await Order.create({
        user_id: userId,
        total_amount: amount,
        status: "pending",
        shipping_address: "123 Fake Street, Test City",
        order_date: new Date(),
        created_at: new Date(),
        products: products,
      });

      const orderId = newOrder._id.toString();
      console.log("New order created:", newOrder);

      const paymentUrl = await OrderPaymentService.createVNPayPaymentUrl({
        amount,
        orderId,
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
      console.log("VNPAY Return Params:", vnpParams); // Log để debug

      const result = await OrderPaymentService.verifyVNPayReturn(vnpParams);

      if (result.isValid && result.responseCode === "00") {
        const orderId = vnpParams["vnp_TxnRef"];
        await Order.findByIdAndUpdate(orderId, { status: "paid" });

        // Redirect về frontend với thông tin thành công
        res.redirect(
          `http://localhost:5173/payment-result?vnp_ResponseCode=00&vnp_TxnRef=${orderId}`
        );
      } else {
        // Redirect về frontend với thông tin thất bại
        res.redirect(
          `http://localhost:5173/payment-result?vnp_ResponseCode=${result.responseCode}`
        );
      }
    } catch (error) {
      console.error("Error handling VNPay return:", error);
      res.redirect("http://localhost:5173/cart?vnp_ResponseCode=99"); // Lỗi hệ thống
    }
  }
}
