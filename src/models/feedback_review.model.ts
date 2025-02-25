import { model, Schema } from "mongoose";
import { IFeedback } from "../interfaces/feedback_review.interface";

  const feedbackSchema: Schema<IFeedback>= new Schema(
    {
      user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      service_id: { type: Schema.Types.ObjectId, ref: 'Service', required: true }, 
      message: { type: String, required: true },  
      rating: { type: Number, min: 1, max: 5, required: true },
    },
    { timestamps: true }
  );
  export const Feedback = model<IFeedback>('Feedback', feedbackSchema);
  