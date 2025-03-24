import { Schema, model } from "mongoose";
import { IStaff } from "../interfaces/staff.interface";

const staffSchema: Schema<IStaff> = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    salary: { type: Number, required: true },
    service_id: [{ type: Schema.Types.ObjectId, ref: "Service" }],
  },
  { timestamps: true }
);

export const Staff = model<IStaff>("Staff", staffSchema);
