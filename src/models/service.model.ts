import { Schema, model, Document } from "mongoose";
import { IService } from "../interfaces/service.interface";

const serviceSchema: Schema<IService> = new Schema(
  {
    service_name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    available: { type: String, enum: ["yes", "no"], required: true },
  },
  { timestamps: true }
);

export const Service = model<IService>("Service", serviceSchema);
