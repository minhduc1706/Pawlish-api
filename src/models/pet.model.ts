import { Schema, model, Document } from 'mongoose';
import { IPet } from '../interfaces/pet.interface';


const petSchema: Schema<IPet> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    pet_name: { type: String, required: true },
    species_id: { type: Schema.Types.ObjectId, ref: 'PetSpecies', required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    health_notes: { type: String },
  },
  { timestamps: true }
);

export const Pet = model<IPet>('Pet', petSchema);
