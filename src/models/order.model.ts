import { Schema, model, Document } from "mongoose";
import { IOrder } from "../interfaces/order.interface";

const orderSchema: Schema<IOrder> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order_date: { type: Date, required: true },
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "canceled"],
      required: true,
    },
    supplier_id: { type: Schema.Types.ObjectId, ref: "Supplier" },
    shipping_address: { type: String, required: true },
    expected_delivery_date: { type: Date },
    products: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ]
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", orderSchema);
