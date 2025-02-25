import { Schema, model, Document } from 'mongoose';

export interface IService extends Document {
  service_name: string;
  description: string;
  price: number;
  duration: number;
  available: 'yes' | 'no';
  created_at: Date;
  updated_at: Date;
}
