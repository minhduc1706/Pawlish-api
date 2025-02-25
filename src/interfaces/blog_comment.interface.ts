import { Document } from 'mongoose';
import { IBlog } from './blog.interface';
import { IUser } from './user.interface';

export interface IBlogComment extends Document {
  user_id: IUser['_id'];  
  blog_id: IBlog['_id'];  
  content: string; 
  createdAt?: Date;
  updatedAt?: Date;
}

