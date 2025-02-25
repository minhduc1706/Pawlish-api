import { Schema, model, Document } from 'mongoose';
import { IProductCategory } from '../interfaces/product_category.interface';

const productCategorySchema: Schema<IProductCategory> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const ProductCategory = model<IProductCategory>('ProductCategory', productCategorySchema);
