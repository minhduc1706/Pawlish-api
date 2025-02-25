import  { Schema, Document, model } from 'mongoose';
import { IBlog } from './blog.interface';

export interface IBlogTag extends Document {
  blog_id: IBlog['_id'];
  tag_name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

