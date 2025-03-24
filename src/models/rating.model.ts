import { Schema, model } from "mongoose";
import { IRating } from "../interfaces/rating.interface";

const ratingSchema: Schema<IRating> = new Schema(
  {
    staffId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    staffRatings: {
      overall: { type: Number, required: true, min: 0, max: 5 },
      attitude: { type: Number, required: true, min: 0, max: 5 },
      professionalism: { type: Number, required: true, min: 0, max: 5 },
      communication: { type: Number, required: true, min: 0, max: 5 },
      timeliness: { type: Number, required: true, min: 0, max: 5 },
    },
    serviceRatings: {
      overall: { type: Number, required: true, min: 0, max: 5 },
      quality: { type: Number, required: true, min: 0, max: 5 },
      satisfaction: { type: Number, required: true, min: 0, max: 5 },
      timeliness: { type: Number, required: true, min: 0, max: 5 },
      value: { type: Number, required: true, min: 0, max: 5 },
    },
  },
  { timestamps: true }
);

export const Rating = model<IRating>("Rating", ratingSchema);