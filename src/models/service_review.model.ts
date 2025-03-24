import { Schema, model } from "mongoose";
import { IServiceReview } from "../interfaces/service_review.interface";

const serviceReviewSchema: Schema<IServiceReview> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    service_id: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    staff_id: { type: Schema.Types.ObjectId, ref: "Staff", required: true }, 
    rating: { type: Number, required: true, min: 1, max: 5 }, 
    comment: { type: String },
  },
  { timestamps: true }
);

export const ServiceReview = model<IServiceReview>("ServiceReview", serviceReviewSchema);