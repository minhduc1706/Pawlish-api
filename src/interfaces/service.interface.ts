import {  Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  price: number;
  duration: number;
  available: boolean;
  category_id: IService['_id']
  createdAt: Date;
  updatedAt: Date;
}
