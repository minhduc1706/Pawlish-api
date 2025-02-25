import  { Schema, Document } from 'mongoose';
import { model } from 'mongoose';
import { IBlog } from '../interfaces/blog.interface';


const blogSchema:Schema<IBlog> = new Schema(
  {
    author_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Blog = model<IBlog>('Blog', blogSchema);

