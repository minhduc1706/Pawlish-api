import { Order } from "../models/order.model";
import { IOrder } from "../interfaces/order.interface";

export class OrderService {
  static async getAllOrders(): Promise<IOrder[]> {
    return Order.find()
      .populate("products.product_id")
      .populate("supplier_id");
  }

  static async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    const newOrder = new Order(orderData);
    return newOrder.save();
  }
}