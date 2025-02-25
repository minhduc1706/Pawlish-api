import { Schema, Document, model } from 'mongoose';

export interface IPromotion extends Document {
  promo_code: string;
  discount_percentage: number;
  valid_from: Date;
  valid_to: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
