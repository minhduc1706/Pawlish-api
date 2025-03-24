import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service";
import mongoose from "mongoose";

export class OrderController {
  async getOrders(req: Request, res: Response, next: NextFunction) {

    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      const {
        supplier_id,
        order_date,
        expected_delivery_date,
        status,
        products,
        total_amount,
        shipping_address,
      } = req.body;

      const orderData = {
        user_id: new mongoose.Types.ObjectId(userId),
        supplier_id,
        order_date: order_date || new Date(),
        expected_delivery_date,
        status: status || "pending",
        products,
        total_amount,
        shipping_address,
      };

      const newOrder = await OrderService.createOrder(orderData);
      res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  }
}