import { ISupplier } from "../interfaces/supplier.interface";
import { Schema, model } from "mongoose";

const supplierSchema: Schema<ISupplier> = new Schema(
    {
      name: { type: String, required: true },
      contactPerson: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      notes: { type: String },
    },
    { timestamps: true } 
  );

  export const Supplier = model<ISupplier>("Supplier", supplierSchema);