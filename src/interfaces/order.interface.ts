import { Document } from "mongoose";
import { IUser } from "./user.interface";
import { IProduct } from "./product.interface";
import { ISupplier } from "./supplier.interface";

export interface IOrder extends Document {
  user_id: IUser["_id"];
  order_date: Date;
  total_amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "canceled";
  shipping_address?: string;
  supplier_id?: ISupplier["_id"];
  expected_delivery_date?: Date;
  products: [
    {
      product_id: IProduct["_id"];
      quantity: number;
    }
  ];
  createdAt: Date;
  updatedAt: Date;
}
