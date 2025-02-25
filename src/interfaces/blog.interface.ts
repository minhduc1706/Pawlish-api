import  { Document } from 'mongoose';
import { IUser } from './user.interface';

export interface IBlog extends Document {
  author_id: IUser['_id'];
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

