import { IProduct } from "./product.interface";

export interface IStockMovement extends Document {
    productId: IProduct["_id"];
    date: Date;
    type: "in" | "out" | "adjustment";
    quantity: number;
    reason: string;
    performedBy: string;
    reference?: string;
  }