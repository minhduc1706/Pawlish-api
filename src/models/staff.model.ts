import { Schema, model, Document } from "mongoose";
import { IStaff } from "../interfaces/staff.interface";

const staffSchema: Schema<IStaff> = new Schema(
  {
    full_name: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      enum: ["groomer", "admin", "vet"],
      required: true,
    },
    salary: { type: Number, required: true },
    status: { type: String, enum: ['active', 'block'] },
  },
  { timestamps: true }
);

export const Staff = model<IStaff>("Staff", staffSchema);
