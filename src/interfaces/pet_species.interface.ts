import { Schema, model, Document } from 'mongoose';

export interface IPetSpecies extends Document {
  name: string;
  description: string;
  created_at: Date;
}

