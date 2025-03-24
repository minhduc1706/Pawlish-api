import { model, Schema } from "mongoose";
import { IStockMovement } from "../interfaces/stockMovement.interface";

const StockMovementSchema = new Schema<IStockMovement>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ["in", "out", "adjustment"], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, required: true },
  performedBy: { type: String, required: true },
  reference: { type: String },
});

export const StockMovement = model<IStockMovement>(
  "StockMovement",
  StockMovementSchema
);
