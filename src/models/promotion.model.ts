import { Schema, Document, model } from 'mongoose';
import { IPromotion } from '../interfaces/promotion.interface';


const promotionSchema:Schema<IPromotion> = new Schema(
  {
    promo_code: { type: String, required: true },
    discount_percentage: { type: Number, required: true },
    valid_from: { type: Date, required: true },
    valid_to: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Promotion = model<IPromotion>('Promotion', promotionSchema);

