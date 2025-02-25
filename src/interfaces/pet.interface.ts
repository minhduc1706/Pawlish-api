import { Schema, model, Document } from 'mongoose';
import { IPetSpecies } from './pet_species.interface';
import { IUser } from './user.interface';

export interface IPet extends Document {
  user_id: IUser['_id'];
  pet_name: string;
  species_id: IPetSpecies['_id'];
  breed: string;
  age: number;
  weight: number;
  gender: 'male' | 'female';
  health_notes: string;
  created_at: Date;
  updated_at: Date;
}
