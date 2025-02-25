import { Schema, model, Document } from 'mongoose';
import { IOrder } from './order.interface';
import { IProduct } from './product.interface';

export interface IOrderItem extends Document {
  order_id: IOrder['_id'];
  product_id: IProduct['_id'];
  quantity: number;
  price: number;
}
