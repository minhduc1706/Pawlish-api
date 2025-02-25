import { Schema, Document, model } from 'mongoose';
import { ICoupon } from '../interfaces/coupon.interface';

const couponSchema:Schema<ICoupon> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    promotion_id: { type: Schema.Types.ObjectId, ref: 'Promotion', required: true },
    discount_amount: { type: Number, required: true },
    valid_from: { type: Date, required: true },
    valid_to: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['active', 'used', 'expired'], 
      required: true 
    },
  },
  { timestamps: true }
);

export const Coupon = model<ICoupon>('Coupon', couponSchema);

