import { model, Schema } from "mongoose";
import { IServiceCategory } from "../interfaces/service_category.interface";

const serviceCategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
}, { timestamps: true });

export const ServiceCategory = model<IServiceCategory>("ServiceCategory", serviceCategorySchema);