import { Document } from 'mongoose';
import { IPromotion } from './promotion.interface';
import { IUser } from './user.interface';

export interface ICoupon extends Document {
  user_id: IUser['_id'];
  promotion_id: IPromotion['_id'];
  discount_amount: number;
  valid_from: Date;
  valid_to: Date;
  status: 'active' | 'used' | 'expired';
  createdAt?: Date;
  updatedAt?: Date;
}

