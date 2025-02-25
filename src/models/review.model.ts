import { model, Schema } from "mongoose";
import { IReview } from "../interfaces/review.interface";

  const reviewSchema:Schema<IReview> = new Schema(
    {
      user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },  
      rating: { type: Number, min: 1, max: 5, required: true }, 
      comment: { type: String }, 
    },
    { timestamps: true }
  );
  
  export const Review = model<IReview>('Review', reviewSchema);
  