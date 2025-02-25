import { Schema, Document, model } from 'mongoose';
import { IBlogComment } from '../interfaces/blog_comment.interface';

const blogCommentSchema: Schema<IBlogComment> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blog_id: { type: Schema.Types.ObjectId, ref: 'Blog', required: true }, 
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const BlogComment = model<IBlogComment>('BlogComment', blogCommentSchema);

