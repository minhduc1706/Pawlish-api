import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.interface';

export interface IOrder extends Document {
  user_id: IUser['_id'];
  order_date: Date;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
  shipping_address: string;
  created_at: Date;
  updated_at: Date;
}

