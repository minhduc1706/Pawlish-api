import { Schema, model } from "mongoose";
import { IReport } from "../interfaces/report.interface";

const reportSchema: Schema<IReport> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["weekly", "monthly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    period: { type: String, required: true },
    date: { type: Date, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Report = model<IReport>("Report", reportSchema);