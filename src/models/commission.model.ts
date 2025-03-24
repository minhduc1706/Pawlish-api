import mongoose, { Schema } from "mongoose";
import { ICommission } from "../interfaces/commission.interface";

const commissionSchema = new Schema<ICommission>(
  {
    staff_id: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export const  Commission = mongoose.model<ICommission>("Commission", commissionSchema);