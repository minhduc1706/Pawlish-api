import { Schema, model } from 'mongoose';
import { IProduct } from '../interfaces/product.interface';
import { ProductCategory } from "./product_category.model";

const productSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock_quantity: { type: Number, required: true },
    imgUrl: { type: String },
    category_id: { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);
