import { Order } from "../models/order.model";
import { IOrder } from "../interfaces/order.interface";
import mongoose from "mongoose";

export class OrderService {
  static async getAllOrders(): Promise<IOrder[]> {
    return Order.find().populate("products.product_id").populate("supplier_id");
  }

  static async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    const newOrder = new Order(orderData);
    return newOrder.save();
  }

  static async getCustomerOrders(id: string): Promise<IOrder[]> {
    const objectId = new mongoose.Types.ObjectId(id);
    const orders = await Order.find({ user_id: objectId }).populate({
      path: "products.product_id",
      select: "name price imgUrl",
    });
    return orders;
  }
}
