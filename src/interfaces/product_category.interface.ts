import { Schema, model, Document } from 'mongoose';

export interface IProductCategory extends Document {
  name: string;
  description: string;
  created_at: Date;
}
