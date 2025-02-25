import { Schema, model, Document } from "mongoose";
import { IOrderItem } from "../interfaces/order_item.interface";

const orderItemSchema: Schema<IOrderItem> = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

export const OrderItem = model<IOrderItem>("OrderItem", orderItemSchema);
