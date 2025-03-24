import { Document } from 'mongoose';
import { IProductCategory } from './product_category.interface';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  imgUrl?: string;
  category_id: IProductCategory['_id'];
  createdAt: Date;
  updatedAt: Date;
}
