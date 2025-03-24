import { Schema, model, Document } from 'mongoose';
import { IUser } from './user.interface';

export interface IPet extends Document {
  user_id: IUser['_id'];
  name: string;
  species: string
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  health_notes: string;
  createdAt: Date;
  updatedAt: Date;
}
