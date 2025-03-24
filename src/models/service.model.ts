import { Schema, model } from "mongoose";
import { IService } from "../interfaces/service.interface";

const serviceSchema: Schema<IService> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 1 },
    category_id: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
    available: { type: Boolean,default: true },
  },
  { timestamps: true }
);

export const Service = model<IService>("Service", serviceSchema);
