import { Document } from 'mongoose';

export interface IServiceCategory extends Document {
  name: string;
  description: string;
  createdAt: Date;
}
