import {Document } from 'mongoose';
import { IUser } from './user.interface';

export interface INotification extends Document {
  user_id: IUser['_id'];
  title: string;
  content: string;
  is_read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
